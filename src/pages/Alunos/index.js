import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import { FiXCircle, FiEdit, FiUserX } from 'react-icons/fi';
import logoCadastro from "../../assets/cadastro1.png"
import api from '../../services/api';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';


export default function Alunos() {

  //const [nome, setNome] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filtro, setFiltro] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [updateData, setUpdateData] = useState(true);

  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');

  const history = useHistory();

  const authorization = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  useEffect(() => {
    if (updateData) {
      api.get('api/alunos', authorization).then(
        response => {
          setAlunos(response.data);
          setUpdateData(false);
        }, token)
    }
  });

  const searchAlunos = (searchValue) => {
    setSearchInput(searchValue);
    if (searchInput !== "") {
      const dadosFiltrados = alunos.filter((item) => {
        return Object.values(item).join('').toLowerCase()
          .includes(searchInput.toLowerCase());
      });
      setFiltro(dadosFiltrados);
    } else {
      setFiltro(alunos)
    }
  }

  async function editAluno(id) {
    try {
      history.push(`aluno/novo/${id}`);
    } catch (error) {
      alert('Não foi possível editar o aluno.');
    }
  }

  async function deleteAluno(id) {
    try {
      if(window.confirm(`você deseja deletar o aluno de id = ${id}?`)){
        await api.delete(`api/alunos/${id}`, authorization);
        setAlunos(alunos.filter(aluno => aluno.id !== id));
      }
    } catch (error) {
      alert('Não foi possível excluir o aluno ' + error);
    }
  }

  async function logout() {
    try {
      localStorage.clear();
      localStorage.setItem('token', '');
      authorization.headers = '';
      history.push('/');
    } catch (err) {
      alert('Não foi possível fazer o logout ' + err);
    }
  }

  return (
    <div className="aluno-container">
      <header>
        <img src={logoCadastro} alt="Cadastro" />
        <span>Bem-vindo, <strong>{email}</strong>!</span>
        <Link className="button" to="/aluno/novo/0">Novo Aluno</Link>
        <button type='buttom' onClick={logout}>
          <FiXCircle size={35} color="#17202a" />
        </button>
      </header>

      <form>
        <input type='text' placeholder='Filtrar por nome...'
          onChange={(e) => searchAlunos(e.target.value)} />

        {/* <button type="button" className="button">
          Filtrar aluno por nome (parcial)
        </button> */}

      </form>

      <h1>Relação de Alunos</h1>
            {searchInput.length > 1 ? (
               <ul> 
               {filtro.map(aluno => (
                    <li key={aluno.Id}>
                        <b>Nome:</b>{aluno.nome}<br/><br/>
                        <b>Email:</b>{aluno.email}<br/><br/>
                        <b>Idade:</b>{aluno.idade}<br/><br/>
                        <button onClick={()=> editAluno(aluno.id)} type="button">
                            <FiEdit size="25" color="#17202a" />
                        </button>
                        <button type="button" onClick= {()=> deleteAluno(aluno.id)}> 
                            <FiUserX size="25" color="#17202a" />
                        </button>
                    </li>
                ))}
              </ul>
              ) : (
            <ul>
               {alunos.map(aluno=>(
                 <li key={aluno.id}>
                  <b>Nome:</b>{aluno.nome}<br/><br/>
                  <b>Email:</b>{aluno.email}<br/><br/>
                  <b>Idade:</b>{aluno.idade}<br/><br/>

                 <button onClick={()=> editAluno(aluno.id)} type="button">
                     <FiEdit size="25" color="#17202a" />
                 </button>

                 <button type="button" onClick= {()=> deleteAluno(aluno.id)}> 
                         <FiUserX size="25" color="#17202a" />
                   </button>
               </li>
                ))}
            </ul>
           )}
        </div>
  );
}