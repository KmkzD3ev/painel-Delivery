import './home.css'
import { auth ,signInWithEmailAndPassword} from '../../services/firebaseconection';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import logo2 from "../../assets/logo2.png"
import { Link } from 'react-router-dom';
import { useRef } from 'react';


export default function Singin (){
const [email , setEmail] = useState('');
const [senha ,setSenha] = useState('');
const navigate = useNavigate();
const emailRef = useRef();
const senhaRef = useRef();


async  function handleSigInd(e){
    e.preventDefault();
    if(email !=='' && senha!== ''){
        
   await signInWithEmailAndPassword(auth,email,senha)
   .then((value) => {
   
    console.log("deu certo" + value)
    navigate("/Home")
})
.catch((error) => { // Corrigi a chamada para .catch() aqui
    console.log(error)
    alert("deu certo")
});
   

    }

}




    return (
        <div className="container">
            <div className="logo1">
                <div className='style-img'>
                    <img src={logo2} alt="Logo" />
                </div>
            </div >
            <form   onSubmit={handleSigInd} className="form">
                <h1>Entrar</h1>
                <div className="form-group">
                    <input className='input-style1' type='text' 

                    placeholder='Digite seu Email' 

                    style={{padding: '15px'}} 

                    value={email} onChange={(e) =>setEmail(e.target.value)}
                    
                    />

                    <input className='input-style2' type='password'

                     placeholder='**********'
                     
                     style={{padding: '15px'}} 
                     
                     value={senha} onChange={(e)=>setSenha(e.target.value)}
                     
                     />
                    </div>
                    <button type="submit" className='form-button'>
                     Acessar
                </button>
            </form>
        </div>
    );
}