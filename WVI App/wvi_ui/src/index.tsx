import ReactDOM from 'react-dom/client';
import './tailwind.css'
import './index.css'
import Home from './Components/home';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<Home />);
