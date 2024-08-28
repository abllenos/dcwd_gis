// import React from 'react';
// import { Layout } from 'antd';
// import 'leaflet/dist/leaflet.css';

// // import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import BrowserRouter
// import NavBar from './components/navbar';
// import logo from './assets/image/logo.png';
// import './App.css';
// import './index.css';
// // import AccessLevel from './components/AccessLevel';
// // import Dashboard from './components/CustomerStat';
// // import UserLogs from './components/UserLogs';
// // import Department from './components/Department';

// const { Header, Content, Footer, Sider } = Layout;

// const App: React.FC = () => {
//   return (
//     <div>
//     {/* <Router> */}
//       <Layout style={{ minHeight: '50vh' }}>
//         <Sider theme='light' width={256}>
//           <img src={logo} style={{ height: '30px', margin: '19px 0 10px 70px' }} alt="dcwd" />
//           <NavBar />
//         </Sider>
//         <Layout>
//           <Header style={{ fontSize: '25px', background: 'white' }}>
//             <span style={{ fontWeight: '400', margin: '0 0 0 0' }}> </span>
//           </Header>
//           {/* <Routes>
//             <Route path="/AccessLevel" element={<AccessLevel />} />
//             <Route path="/Dashboard" element={<Dashboard />} />
//             <Route path="/UserLogs" element={<UserLogs />} />
//             <Route path="/Department" element={<Department />} />
//           </Routes> */}
//         </Layout>
//       </Layout>
//     {/* </Router> */}
//     </div>
//   );
// };

// export default App;


import { Menu } from 'antd';
import { Link } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <Menu>
      {/* Ensure all menu items are valid */}
      <Menu.Item key="1">
        <Link to="/dashboard">Dashboard</Link>
      </Menu.Item>
      {/* Add other Menu.Items here */}
    </Menu>
  );
};

export default App;
