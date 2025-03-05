import { computed, markRaw, nextTick, reactive, type VNode } from "vue";

// VNode包装器，用于存储VNode和访问时间
class VNodeWrapper {
	constructor(
		public vnode: VNode,
		public lastAccessed: number,
	) { }
}

interface CacheOptions {
	max?: number;
}

export const useCache = (options: CacheOptions) => {
	const { max = 10 } = options;

	const state = reactive<{
		keySet: Set<string>;
		// 使用Map存储key到VNodeWrapper的映射
		keyToWrapper: Map<string, VNodeWrapper>;
		// 使用WeakMap存储VNodeWrapper到VNode的映射，减少内存泄漏风险
		componentMap: WeakMap<VNodeWrapper, VNode>;
		refreshing: boolean;
		activeKey: string | undefined;
	}>({
		keySet: new Set<string>(),
		keyToWrapper: new Map(),
		componentMap: new WeakMap(),
		refreshing: false,
		activeKey: undefined,
	});

	const keys = computed(() => Array.from(state.keySet));

	/**
	 * 设置当前活动的key，并更新其最后访问时间
	 */
	const setActiveKey = (key: string | undefined) => {
		state.activeKey = key;
		if (key) {
			const wrapper = state.keyToWrapper.get(key);
			if (wrapper) wrapper.lastAccessed = Date.now();
		}
	};

	/**
	 * 添加key到缓存集合中
	 */
	const add = (key: string) => {
		state.keySet.add(key);
	};

	/**
	 * 检查key是否存在于缓存中
	 */
	const has = (key: string) => {
		return state.keySet.has(key);
	};

	/**
	 * 检查key对应的组件是否存在
	 */
	const hasComponent = (key: string) => {
		const wrapper = state.keyToWrapper.get(key);
		return Boolean(wrapper && state.componentMap.has(wrapper));
	};

	/**
	 * 获取key对应的组件
	 */
	const getComponent = (key: string) => {
		const wrapper = state.keyToWrapper.get(key);
		return wrapper ? state.componentMap.get(wrapper) : undefined;
	};

	/**
	 * 移除最久未使用的键
	 * 返回被移除的键，如果没有键被移除则返回undefined
	 */
	const removeOldestEntry = (): string | undefined => {
		if (state.keyToWrapper.size === 0) return undefined;

		const entries = Array.from(state.keyToWrapper.entries());
		if (entries.length === 0) return undefined;

		const oldestEntry = entries.reduce(
			(acc, curr) => acc[1].lastAccessed < curr[1].lastAccessed ? acc : curr,
			entries[0]
		);

		const oldestKey = oldestEntry?.[0];
		if (oldestKey) {
			remove(oldestKey);
			return oldestKey;
		}

		return undefined;
	};

	/**
	 * 添加组件到缓存中
	 */
	const addComponent = (key: string, vNode: VNode) => {
		// 确保key已添加到keySet
		add(key);

		// 如果已达到最大缓存数，移除最旧的项
		if (state.keySet.size > max) {
			removeOldestEntry();
		}

		// 创建新的包装器，使用markRaw避免Vue对VNode的响应式处理
		const wrapper = new VNodeWrapper(markRaw(vNode), Date.now());

		// 更新映射
		state.keyToWrapper.set(key, wrapper);
		state.componentMap.set(wrapper, vNode);
	};

	/**
	 * 从缓存中移除指定key
	 */
	const remove = (key: string) => {
		if (!key) return;

		state.keySet.delete(key);
		state.keyToWrapper.delete(key);
		// componentMap作为WeakMap会自动处理未引用的对象
	};

	/**
	 * 重置缓存
	 */
	const reset = () => {
		state.keySet.clear();
		state.keyToWrapper.clear();
		// componentMap作为WeakMap会自动处理未引用的对象
	};

	/**
	 * 刷新特定key的组件
	 */
	const refresh = async (key: string) => {
		if (!key) return;

		const wrapper = state.keyToWrapper.get(key);
		const component = wrapper ? state.componentMap.get(wrapper) : undefined;

		if (!wrapper || !component) return;

		// 移除旧的映射
		state.keyToWrapper.delete(key);

		const isActiveKey = state.activeKey === key;

		if (isActiveKey) {
			state.refreshing = true;
			state.keySet.delete(key);
		}

		await nextTick();

		// 创建新的包装器
		const newWrapper = new VNodeWrapper(markRaw(component), Date.now());
		state.keyToWrapper.set(key, newWrapper);
		state.componentMap.set(newWrapper, component);

		if (isActiveKey) {
			state.refreshing = false;
			state.keySet.add(key);
		}
	};

	/**
	 * 强制清理未使用的缓存条目
	 * 可以定期调用此函数以防止内存泄漏
	 */
	const cleanup = () => {
		if (state.keySet.size <= max) {
			return;
		}

		// 获取并排序所有条目
		const sortedEntries = Array.from(state.keyToWrapper.entries())
			.sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);

		// 计算需要移除的条目数量
		const entriesToRemove = sortedEntries.slice(0, sortedEntries.length - max);

		// 移除过期条目
		for (const [key] of entriesToRemove) {
			remove(key);
		}
	};

	return {
		state,
		keys,
		setActiveKey,
		add,
		has,
		hasComponent,
		getComponent,
		addComponent,
		remove,
		reset,
		refresh,
		cleanup,
	};
};

export type Cache = ReturnType<typeof useCache>;
