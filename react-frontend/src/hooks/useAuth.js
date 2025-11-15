import { useContext } from 'react';
import AuthContext from '../assets/store/AuthContext.jsx';

const useAuth = () => useContext(AuthContext);

export default useAuth;
