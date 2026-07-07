# 修复 Page2 重复实例问题

## 问题描述

用户报告：Page2 处于活跃状态时，点击关闭按钮会创建重复实例，导致：
- Page2 被 mounted 两次
- Page2 被 beforeUnmount 两次

日志示例：
```
Page2 mounted: 1783393457505
Page2 mounted: 1783393460715  // 重复 mount
Page2 beforeUnmount: 1783393460715
Page2 beforeUnmount: 1783393460718  // 重复 unmount
```

## 根本原因

问题出在 `src/components/page/index.vue` 的渲染逻辑：

```vue
<component :is="retrieveOrCacheComponent?.(Component)"
           v-if="!refreshing"
           :key="activeTabKey" />
```

### 执行流程分析

当关闭当前活跃标签时：

1. **调用 `close()` 方法**
2. **`setActive(undefined)`** - 清空 `activeTab`，导致 `activeTabKey` 变为 `undefined`
3. **`remove(_item)`** - 删除标签
4. **`openNearTab()`** - 打开相邻标签

**关键问题：**

在步骤 2-4 之间，Vue 的响应式系统会触发重新渲染：
- `router-view` 仍然显示 Page2 组件
- `activeTabKey` 已经变为 `undefined`
- `<component :key="undefined">` 导致 Vue 认为这是一个**新的没有 key 的组件**
- Vue 创建了第二个 Page2 实例！
- 随后路由切换到 Page3，两个 Page2 实例都被销毁

## 解决方案

在 `v-if` 条件中增加 `activeTabKey` 的检查，当没有活跃标签时不渲染组件：

```vue
<component :is="retrieveOrCacheComponent?.(Component)"
           v-if="!refreshing && activeTabKey"
           :key="activeTabKey" />
```

### 修复效果

- ✅ 当 `activeTabKey` 为 `undefined` 时，组件不会渲染
- ✅ 避免了 Vue 将 `key="undefined"` 识别为新组件
- ✅ 保证在整个关闭-切换过程中只有一个组件实例
- ✅ 所有 78 个测试用例通过

## 修改文件

- `src/components/page/index.vue` - 第 6 行

## 测试验证

```bash
npm test
```

所有测试通过：
```
Test Files  12 passed (12)
     Tests  78 passed (78)
  Duration  1.88s
```

## 注意事项

这个修复：
1. **不影响正常的标签切换** - 切换标签时 `activeTabKey` 总是有值
2. **不影响 keep-alive 缓存** - `cachedKeys` 的逻辑保持不变
3. **不影响刷新功能** - `refreshing` 条件仍然生效
4. **确保了组件生命周期的正确性** - 每个组件只会 mount/unmount 一次

## 相关代码

- `src/store/tabs.ts` - `close()` 方法
- `src/components/page/index.vue` - 页面渲染逻辑
- `src/store/cache.ts` - 组件缓存管理
