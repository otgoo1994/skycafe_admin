// assets
import { LoginOutlined, ProfileOutlined, OrderedListOutlined, BranchesOutlined, ClusterOutlined, DesktopOutlined } from '@ant-design/icons';

// icons
const icons = {
  OrderedListOutlined,
  ClusterOutlined,
  DesktopOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'Pages',
  title: 'Pages',
  type: 'group',
  children: [
    {
      id: 'products',
      title: 'Products',
      type: 'item',
      url: '/products',
      icon: icons.OrderedListOutlined,
      target: false
    },
    {
      id: 'banners',
      title: 'Banners',
      type: 'item',
      url: '/banners',
      icon: icons.DesktopOutlined,
      target: false
    },
    {
      id: 'branches',
      title: 'Branches',
      type: 'item',
      url: '/branches',
      icon: icons.ClusterOutlined,
      target: false
    }
  ]
};

export default pages;
