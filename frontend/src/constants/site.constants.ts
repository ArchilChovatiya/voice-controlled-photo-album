import { Layout } from '../components/app/layouts';
import { Wrapper } from '../components/app/wrappers';

type LayoutWithWrapper = Layout & Wrapper;

export interface SiteConfig {
  sections: LayoutWithWrapper[];
}

const site: SiteConfig = {
  sections: [

    {
      id: 'config-manager',
      layoutName: 'Dynamic',

      wrap: 'Box',
      horizontal: true,

      components: [],
    },

    {
      id: 'streaming',
      layoutName: 'Dynamic',

      wrap: 'Box',
      heading: 'Smart Photo Album',

      components: [{ componentName: 'StreamingView' }],
    },
  ],
};

export default site;
