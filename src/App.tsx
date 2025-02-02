import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import SignInUp from './pages/SignInUp';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import UserProfile from './pages/UserProfile';
import SeePost from './pages/SeePost';
import SearchPage from './pages/SearchPage';
import ViewUserProfile from './pages/ViewUserProfile';
import Layout from '@/components/Layout';
import ViewNotifications from './pages/ViewNotifications';
import NewSign from './pages/NewSign';
import { RootState } from '@/state/store';
import Confirmation from './pages/Confirmation';
import { SidebarProvider } from './context/SidebarContext';
import AboutPage from './pages/AboutPage';


function App() {
  const isAuth = Boolean(useSelector((state: RootState) => state.auth.token));

  return (
    <BrowserRouter>
      <SidebarProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={isAuth ? <Navigate to="/home" /> : <NewSign />} />
          <Route path="/verify-email" element={<Confirmation />} />
          <Route path='/about' element={<AboutPage />}/>

          {/* Protected Routes */}
          {isAuth && (
            <Route path="/" element={<Layout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/new" element={<CreatePost />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/posts/:id" element={<SeePost />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/users/:id" element={<ViewUserProfile />} />
              <Route path="/notifications" element={<ViewNotifications />} />
            </Route>
          )}

          {/* Redirect to SignInUp if not authenticated */}
          {!isAuth && <Route path="*" element={<Navigate to="/" />} />}
        </Routes>
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;
