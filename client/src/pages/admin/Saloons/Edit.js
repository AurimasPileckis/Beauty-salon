import { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import MainContext from '../../../context/MainContext'


const EditSaloon = () => {
    const { setAlert } = useContext(MainContext)
    const { id } = useParams()
    
    const [saloon, setSaloon] = useState({
        name: '',
        adress: '',
        phone: ''
    })


    const navigate = useNavigate()

    useEffect(() => {
        axios.get('/api/saloons/' + id)
        .then(resp => {
            if(!resp.data) {
                navigate('/admin')
                return
            }

            setSaloon(resp.data)
        })
        .catch(error => {
            console.log(error)
            navigate('/admin')
        })
    }, [id, navigate])

    const handleForm = (e) => {
        setSaloon({...saloon, [e.target.name]: e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        axios.put('/api/saloons/edit/' + id, saloon)
        .then(resp => {
            setAlert({
                message: resp.data,
                status: 'success'
            })
            
            navigate('/admin')

        })
        .catch(error => {
            setAlert({
                message: error.response.data,
                status: 'danger'
              })
              window.scrollTo(0, 0)
      
              if(error.response.status === 401)
                setTimeout(() => navigate('/login'))
        })

    }

    return(
        <>
        <div className="container mw-50">
            <h1>Grožio salono redagavimas</h1>
            <form onSubmit={(e) => handleSubmit(e)}>
                <div className="form-group mb-2">
                    <label className="mb-1">Pavadinimas:</label>
                    <input type="text" name="name" className="form-control" onChange={handleForm} value={saloon.name} />
                </div>
                <div className="form-group mb-2">
                    <label className="mb-1">Adresas:</label>
                    <input type="text" name="adress" className="form-control" onChange={handleForm} value={saloon.adress} />
                </div>
                <div className="form-group mb-2">
                    <label className="mb-1">Telefono nr.:</label>
                    <input type="text" name="phone" className="form-control" onChange={handleForm} value={saloon.phone} />
                </div>
                <button className="btn btn-primary">Išsaugoti</button>
            </form>
        </div>
        </>
    )
}
export default EditSaloon