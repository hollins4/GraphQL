import { useMutation } from "@apollo/client"
import { useState } from 'react' 
import Authors from "./Authors"
import { AUTHOR_BORN, ALL_BOOKS, ALL_AUTHORS } from './queries'

const AuthorBorn = ({ authors }) => {
    const [name, setName] = useState('')
    const [born, setBorn ] = useState('')

    const [ authorBorn ] = useMutation(AUTHOR_BORN, {
        refetchQueries: [ { query: ALL_BOOKS}, {query: ALL_AUTHORS}]
    })

    const submit = (event) => {
        event.preventDefault()
        
        authorBorn( {variables: {name, born} })
        console.log('edit birhday...')

        setName('')
        setBorn('')
    }

    const handleChange = (event) => {
        setName(event.target.value)
    }

    return(
        <div>
            <h2>set birthyear</h2>
            <br />
            <form onSubmit={submit}>
                <select value={name} onChange={handleChange}>
                    {authors.map(author => {
                        return <option value={author.name}>{author.name}</option>
                    })}
                </select>
                <div>
                    born
                    <input type="number" value={born} onChange={({target}) => setBorn(Number(target.value))}/>
                </div>
                <button type="submit">Update Author</button>
            </form>
        </div>
    )
}

export default AuthorBorn