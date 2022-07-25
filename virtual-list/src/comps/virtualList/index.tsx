import { useEffect, useState } from 'react';
import Item from '../Item';
import './index.css';
import { faker } from '@faker-js/faker';

// 每一个列表项的高度
const height = 60;
// 每一个列表项的预估高度
const estimatedItemHeight = 80;
// 列表项的数据量是1000
const dataSize = 1000;
// 缓存项的数目
const bufferSize = 5;

function fakerData() {
  const a = [];
  for (let i = 0; i < dataSize; i += 1) {
    a.push({
      id: i,
      words: faker.lorem.words(),
      paragraphs: faker.lorem.sentences(),
    });
  }

  return a;
}

const data = fakerData();

let startIndex = 0;
let endIndex = 0;
let lastScrollTop = 0;

// 缓存已渲染元素的位置信息
const caches: {
  index: number,
  top: number,
  bottom: number
}[] = [];
// 缓存锚点元素的位置信息
let anchorItem = {
  index: 0, // 锚点元素的索引值
  top: 0, // 锚点元素的顶部距离第一个元素的顶部的偏移量（即 startOffset）
  bottom: 0, // 锚点元素的底部距离第一个元素的顶部的偏移量
};

function VirtualList() {
  const [state, setState] = useState<{
    startOffset: number,
    endOffset: number,
    visibleData: any[]
  }>({
    startOffset: 0,
    endOffset: 0,
    visibleData: [],
  });

  const updateVisibleData = () => {
    // 可视区域的数据
    const visibleData = data.slice(startIndex, endIndex);
    // 尾部距离容器底部的距离
    const endOffset = (data.length - endIndex) * height;
    const startOffset = anchorItem.top;

    setState({
      startOffset,
      endOffset,
      visibleData,
    });
  };

  useEffect(() => {
    // 可视区域的数量
    const visibleCount = Math.ceil(window.innerHeight / estimatedItemHeight) + bufferSize;
    // 可是区域尾部的项的索引
    endIndex = startIndex + visibleCount;
    // 更新数据
    updateVisibleData();

    let doc: HTMLElement | null = null;

    const updateBoundaryIndex = (scrollTop: number) => {
    // 用户正常滚动下，根据scrollTop找到新的锚点元素位置
      const targetAnchorItem = caches.find((item) => item.bottom >= scrollTop);
      console.log('cache:', caches);
      if (!targetAnchorItem) {
      // 用户滚的太快,找不到锚点元素，暂不处理
        return;
      }
      // 更新锚点位置
      anchorItem = { ...targetAnchorItem };
      startIndex = targetAnchorItem.top;
      endIndex = startIndex + visibleCount;
    };

    // 监听滚动事件
    const handleScroll = () => {
      if (!doc) {
        doc = window.document.body.scrollTop
          ? window.document.body
          : window.document.documentElement;
      }
      const { scrollTop } = doc;
      if ((scrollTop > lastScrollTop && scrollTop > anchorItem.top)
      || (scrollTop < lastScrollTop && scrollTop < anchorItem.top)) {
        updateBoundaryIndex(scrollTop);
        updateVisibleData();
      }
      lastScrollTop = scrollTop;
    };

    window.addEventListener('scroll', handleScroll, false);
    // return () => {
    //   window.removeEventListener('scroll', handleScroll, false);
    // }
  }, []);

  // 缓存锚点元素的位置
  const cachePosition = (node: Element, index: number) => {
    const rect = node.getBoundingClientRect();
    const top = rect.top + window.pageYOffset;
    caches.push({
      index,
      top,
      bottom: top + rect.height, // 动态获取元素高度
    });
  };

  return (
    <div className="wrapper">
      <div style={{ paddingTop: `${state.startOffset}px`, paddingBottom: `${state.endOffset}px` }}>
        {
          // render list
          state.visibleData.map((item, index) => (
            <Item
              cachePosition={cachePosition}
              // eslint-disable-next-line react/no-array-index-key
              key={startIndex + index}
              index={startIndex + index}
              item={item}
            />
          ))
        }
      </div>
    </div>
  );
}
export default VirtualList;
