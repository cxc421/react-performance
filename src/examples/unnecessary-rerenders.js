// http://localhost:3000/isolated/examples/unnecessary-rerenders.js

import * as React from 'react';

function CountButton({count, onClick}) {
  return <button onClick={onClick}>{count}</button>;
}
const MemoCountButton = React.memo(CountButton);

function NameInput({name, onNameChange}) {
  return (
    <label>
      Name: <input value={name} onChange={e => onNameChange(e.target.value)} />
    </label>
  );
}
const MemoNameInput = React.memo(NameInput);

function Example() {
  const [name, setName] = React.useState('');
  const [count, setCount] = React.useState(0);
  const increment = () => setCount(c => c + 1);
  return (
    <div>
      <div>
        <MemoCountButton count={count} onClick={increment} />
      </div>
      <div>
        <MemoNameInput name={name} onNameChange={setName} />
      </div>
      {name ? <div>{`${name}'s favorite number is ${count}`}</div> : null}
    </div>
  );
}

export default Example;
