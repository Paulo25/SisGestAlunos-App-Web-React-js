import React, {useState} from 'react';
import './styles.css';
import logoImage from '../../assets/login.png';
import { useHistory } from 'react-router-dom';
import api from '../../services/api'

export default function Login() {

    //hook useState: amazena o estado inicial/atual da variável e o set é o usado para atualizar o estado
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');

    //hook useHistory: permite acesso a uma instancia da navegação, para acessar outras páginas da navegação
    const history = useHistory('');

    async function login(event)
    {
        event.preventDefault(); //evita o refresh da página
        const data = {
            email, password
        };
        try{
            const response = await api.post('api/account/loginuser', data);

            localStorage.setItem('email', email);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('expiration', response.data.expiration);

            history.push('/alunos');
        }catch(error){
            alert('O login falhou ' + error);
        }
    }

    return (
        <div className="login-container">
          <section className="form">
            <img src={logoImage} alt="Login" id="img1" />
            <form onSubmit={login}>
                <h1>Cadastro de Alunos</h1>
                <input placeholder="Email" 
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                />
                <input type="password" placeholder="Password"
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                />
                <button className="button" type="submit">Login</button>
            </form>
            </section>
        </div>
    )
}