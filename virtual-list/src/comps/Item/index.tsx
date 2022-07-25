import { useEffect } from 'react';

function Item(props:any) {
  let node:HTMLDivElement | null;
  const { index, item, cachePosition } = props;

  useEffect(() => {
    cachePosition(node, index);
  }, []);

  return (
    <div className="list-item" style={{ height: 'auto' }} ref={(_node) => { node = _node; }}>
      <p>
        #$
        {index}
        {' '}
        {item.words}
      </p>
      <p>{item.paragraphs}</p>
    </div>
  );
}
export default Item;
