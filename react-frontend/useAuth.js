import { useContext } from 'react';
import AuthContext from '../store/AuthContext.jsx';

const useAuth = () => useContext(AuthContext);

export default useAuth;