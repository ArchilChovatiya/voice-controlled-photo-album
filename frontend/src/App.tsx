import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import buildAndWrapLayout from './components/app/builders';
import ImageDisplayCard from './components/ui-components/Image_display';
import ImageUploadCard from './components/ui-components/upload_image';
import useSiteConfig from './hooks/use-site-config';
import StoreProviders from './store';

const Main: React.FC = ({children}) => {
  const siteConfig = useSiteConfig();
  const sections = siteConfig.sections.map(buildAndWrapLayout);

  return <div className="flex-grow m-10">{sections} {children} </div>;
};

function App() {
  return (
    <div className="flex mx-auto min-w-0 h-screen">
      <StoreProviders>
        <Router>
          <Switch>
            <Route path="/">
              <Main> 
                <ImageUploadCard />
                <ImageDisplayCard />
              </Main>
            </Route>
          </Switch>
        </Router>
      </StoreProviders>
      
    </div>
    
  );
}

export default App;
