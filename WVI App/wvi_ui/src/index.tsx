import ReactDOM from 'react-dom/client';
import './tailwind.css'
import './index.css'
import Home from './Components/home';

const rootElement = document.getElementById('root') as HTMLElement;
//rootElement.classList.add('h-[100%]');

const root = ReactDOM.createRoot(rootElement);

root.render(<Home />);
