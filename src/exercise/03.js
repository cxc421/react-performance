// React.memo for reducing unnecessary re-renders
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react';
import {useCombobox} from '../use-combobox';
import {getItems} from '../workerized-filter-cities';
import {useAsync, useForceRerender} from '../utils';

function ListItem({
  getItemProps,
  item,
  index,
  selectedItem,
  highlightedIndex,
  ...props
}) {
  const isSelected = selectedItem?.id === item.id;
  const isHighlighted = highlightedIndex === index;
  return (
    <li
      {...getItemProps({
        index,
        item,
        style: {
          fontWeight: isSelected ? 'bold' : 'normal',
          backgroundColor: isHighlighted ? 'lightgray' : 'inherit',
        },
        ...props,
      })}
    />
  );
}
// 🐨 Memoize the ListItem here using React.memo
const MemoListItem = React.memo(ListItem, (prevProps, newProps) => {
  const toIsSelected = props => props.selectedItem?.id === props.item.id;
  const toIsHighlighted = props => props.highlightedIndex === props.index;

  const needToReRender =
    prevProps.getItemProps !== newProps.getItemProps ||
    prevProps.item !== newProps.item ||
    prevProps.index !== newProps.index ||
    toIsSelected(prevProps) !== toIsSelected(newProps) ||
    toIsHighlighted(prevProps) !== toIsHighlighted(newProps);

  return !needToReRender;
});

function Menu({
  items,
  getMenuProps,
  getItemProps,
  highlightedIndex,
  selectedItem,
}) {
  return (
    <ul {...getMenuProps()}>
      {items.map((item, index) => (
        <MemoListItem
          key={item.id}
          getItemProps={getItemProps}
          item={item}
          index={index}
          selectedItem={selectedItem}
          highlightedIndex={highlightedIndex}
        >
          {item.name}
        </MemoListItem>
      ))}
    </ul>
  );
}
// 🐨 Memoize the Menu here using React.memo
const MemoMenu = React.memo(Menu);

function App() {
  const forceRerender = useForceRerender();
  const [inputValue, setInputValue] = React.useState('');

  const {data: allItems, run} = useAsync({data: [], status: 'pending'});
  React.useEffect(() => {
    run(getItems(inputValue));
  }, [inputValue, run]);
  const items = allItems.slice(0, 100);

  const {
    selectedItem,
    highlightedIndex,
    getComboboxProps,
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
    selectItem,
  } = useCombobox({
    items,
    inputValue,
    onInputValueChange: ({inputValue: newValue}) => setInputValue(newValue),
    onSelectedItemChange: ({selectedItem}) =>
      alert(
        selectedItem
          ? `You selected ${selectedItem.name}`
          : 'Selection Cleared',
      ),
    itemToString: item => (item ? item.name : ''),
  });

  console.log({highlightedIndex});

  return (
    <div className="city-app">
      <button onClick={forceRerender}>force rerender</button>
      <div>
        <label {...getLabelProps()}>Find a city</label>
        <div {...getComboboxProps()}>
          <input {...getInputProps({type: 'text'})} />
          <button onClick={() => selectItem(null)} aria-label="toggle menu">
            &#10005;
          </button>
        </div>
        <MemoMenu
          items={items}
          getMenuProps={getMenuProps}
          getItemProps={getItemProps}
          highlightedIndex={highlightedIndex}
          selectedItem={selectedItem}
        />
      </div>
    </div>
  );
}

export default App;

/*
eslint
  no-func-assign: 0,
*/
