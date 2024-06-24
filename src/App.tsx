import React, { useState } from 'react';
import {Parser, OperatorTokenizerFactory, NumberTokenizerFactory} from './parser';
import { Evaluator } from './evaluator';

const buttons = [
  { label: '7', gridArea: 1 },
  { label: '8', gridArea: 1 },
  { label: '9', gridArea: 1 },
  { label: '/', gridArea: 1 },
  { label: '4', gridArea: 2 },
  { label: '5', gridArea: 2 },
  { label: '6', gridArea: 2 },
  { label: '*', gridArea: 2 },
  { label: '1', gridArea: 3 },
  { label: '2', gridArea: 3 },
  { label: '3', gridArea: 3 },
  { label: '-', gridArea: 3 },
  { label: '0', gridArea: 4 },
  { label: '+', gridArea: 4 },
  { label: '=', gridArea: 4, type: 'submit' },
]

const App: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<number | null>(null);
  
  const parser = new Parser([new OperatorTokenizerFactory(), new NumberTokenizerFactory()]);
  const evaluator = new Evaluator();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tokens = parser.parse(expression);      
      const evaluationResult = evaluator.evaluate(tokens);
      setResult(evaluationResult);
      setExpression('')
    } catch (error) {
      console.error('Error evaluating expression:', error);
      setResult(null);
    }
  };

  return (
    <div className="calc">
      <div className="calc__body">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder={result ? result.toString() : "Enter expression"}
          />
          <div className="calc__buttons">
            {buttons.map((button, index) => (
              <div key={index} style={{ gridArea: button.gridArea }} className='calc__button'>
                <button 
                  type={button.type ? 'submit' : 'button'} 
                  onClick={() => button.label !== '=' && setExpression(expression + button.label)}
                >{button.label}</button>
              </div>
            ))}
          </div>
        </form>
      </div>
    </div>
)

}


export default App;