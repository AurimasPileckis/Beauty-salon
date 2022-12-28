import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import MainContext from '../context/MainContext'

const Login = () => {

    const { setAlert, setUserInfo } = useContext(MainContext)
    
        const [form, setForm] = useState({
            email: '',
            password: '',
        })
    
        const navigate = useNavigate()
    
        const handleForm = (e) => {
            setForm({...form, [e.target.name]: e.target.value})
        }
        const handleSubmit = (e) => {
            e.preventDefault()
    
            axios.post('/api/users/login', form)
            .then(resp => {
                
                setUserInfo(resp.data.user)
                setAlert({
                    message: resp.data.message,
                    status: 'success'
                })
                setTimeout(() => {
                    if(resp.data.user.role === 1)
                        return navigate('/admin')

                   navigate('/')
                }, 1000)
            })
            .catch (error => {
                setAlert({
                message: error.response.data,
                status: 'danger'
            })
    
            })
        }
    return (
        <>
             <h1>Login</h1>
        <form className="register-form" onSubmit={handleSubmit}>
            
                
                <input className='form-control' type='email' name='email' placeholder='Email' onChange={handleForm}/>
            
            
                
                <input className='form-control mt-2' type='password' name='password' placeholder='Password' onChange={handleForm} />
        
                <div className='button1'>
                <button className="btn btn-primary mt-1">Login</button>
            </div>
            </form>
            </>
        
    )
}

export default Login