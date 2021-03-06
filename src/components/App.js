import './App.css';
import AppBar from './AppBar';
import SearchResult from './SearchResult';
import AboutDialog from './About';
import MainBody from './MainBody';
import LeftMenuDrawer from './LeftManuDrawer'
import DataModalDisplay from './DataModalDisplay';
import BuildInfoDialog from './BuildInfoDialog';
import DownloadModalDisplay from './DownloadModalDisplay';
import Backdrop from './Backdrop'

function App() {
  return (
    <div className="App">
      <AppBar />
      <Backdrop/>
      <LeftMenuDrawer />
      <DataModalDisplay />
      <DownloadModalDisplay />
      <BuildInfoDialog />
      <MainBody />
      <AboutDialog />
      <SearchResult />
    </div>
  );
}

export default App;
