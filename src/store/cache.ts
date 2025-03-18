import { computed, markRaw, nextTick, reactive, type VNode } from "vue";

// VNode wrapper, used to store VNode and access time
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
		// use Map to store the mapping from key to VNodeWrapper
		keyToWrapper: Map<string, VNodeWrapper>;
		// use WeakMap to store the mapping from VNodeWrapper to VNode, reduce memory leak risk
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
	 * set the current active key, and update its last accessed time
	 */
	const setActiveKey = (key: string | undefined) => {
		state.activeKey = key;
		if (key) {
			const wrapper = state.keyToWrapper.get(key);
			if (wrapper) wrapper.lastAccessed = Date.now();
		}
	};

	/**
	 * add key to cache set
	 */
	const add = (key: string) => {
		state.keySet.add(key);
	};

	/**
	 * check if the key exists in cache
	 */
	const has = (key: string) => {
		return state.keySet.has(key);
	};

	/**
	 * check if the component of a specific key exists
	 */
	const hasComponent = (key: string) => {
		const wrapper = state.keyToWrapper.get(key);
		return Boolean(wrapper && state.componentMap.has(wrapper));
	};

	/**
	 * get the component of a specific key
	 */
	const getComponent = (key: string) => {
		const wrapper = state.keyToWrapper.get(key);
		return wrapper ? state.componentMap.get(wrapper) : undefined;
	};

	/**
	 * remove the oldest key
	 * return the removed key, if no key is removed, return undefined
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
	 * add component to cache
	 */
	const addComponent = (key: string, vNode: VNode) => {
		// ensure key is added to keySet
		add(key);

		// if the maximum cache number is reached, remove the oldest item
		if (state.keySet.size > max) {
			removeOldestEntry();
		}

		// create new wrapper, use markRaw to avoid Vue's reactive processing of VNode
		const wrapper = new VNodeWrapper(markRaw(vNode), Date.now());

		// update mapping
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
		// componentMap as WeakMap will automatically handle objects that are not referenced
	};

	/**
	 * reset cache
	 */
	const reset = () => {
		state.keySet.clear();
		state.keyToWrapper.clear();
		// componentMap as WeakMap will automatically handle objects that are not referenced
	};

	/**
	 * refresh the component of a specific key
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

		// create new wrapper
		const newWrapper = new VNodeWrapper(markRaw(component), Date.now());
		state.keyToWrapper.set(key, newWrapper);
		state.componentMap.set(newWrapper, component);

		if (isActiveKey) {
			state.refreshing = false;
			state.keySet.add(key);
		}
	};

	/**
	 * force clean unused cache entries
	 * can be called periodically to prevent memory leaks
	 */
	const cleanup = () => {
		if (state.keySet.size <= max) {
			return;
		}

		// get and sort all entries
		const sortedEntries = Array.from(state.keyToWrapper.entries())
			.sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);

		// calculate the number of entries to remove
		const entriesToRemove = sortedEntries.slice(0, sortedEntries.length - max);

		// remove expired entries
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
