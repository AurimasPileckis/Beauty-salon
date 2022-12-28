import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import MainContext from '../../../context/MainContext'

const Saloons = () => {
  const [saloons, setSaloons] = useState([])
  const navigate = useNavigate()
  const { alert, setAlert } = useContext(MainContext)

  const handleDelete = (id) => {
      axios.delete('/api/saloons/delete/' + id)
      .then(resp => {
          setAlert({
              message: resp.data,
              status: 'success'
          })
      })
      .catch(error => {
          console.log(error)

          setAlert({
              message: error.response.data,
              status: 'danger'
          })

          if (error.response.status === 401)
              navigate('/login')
      })
  }

  useEffect(() => {
      axios.get('/api/saloons/')
          .then(resp => setSaloons(resp.data))
          .catch(error => console.log(error))
  }, [alert])


    return (
        <>
       <div className="d-flex justify-content-between page-heading">
                <h1>Grožio salonai</h1>
                <Link 
                    to="/admin/saloons/new" 
                    className="btn btn-light"
                    style={{ width: '175px', height: '40px'}}
                    
                >
                    +Naujas salonas
                </Link>
            </div>

        {saloons ? 
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Pavadinimas</th>
                            <th>Adresas</th>
                            <th>Telefono nr.</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {saloons.map(saloon => 
                            <tr key={saloon.id}>
                                <td>{saloon.id}</td>
                                <td>{saloon.name}</td>
                                <td>{saloon.adress}</td>
                                <td>{saloon.phone}</td>
                                <td>
                                <Link 
                                    to={'/admin/saloons/edit/' + saloon.id} 
                                    className="btn btn-light me-2">Redaguoti
                                </Link>
                                <button 
                                    onClick={() => handleDelete(saloon.id)} 
                                    className="btn btn-light">Trinti
                                </button>
                            </td>
                            </tr>
                        )}
                    </tbody>
                </table>
             : 
                <h3>Nėra sukurtų grožio salonų</h3>
            }
        </>
    )
}

export default Saloons