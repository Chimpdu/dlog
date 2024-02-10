import {useState, useContext, useEffect} from 'react'
/* redirect to / after adding post */
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../LanguageContext';

function AddBlog({addBlog}) {
    const { t, i18n } = useTranslation();
    const { language } = useContext(LanguageContext);
    useEffect(() => {
        i18n.changeLanguage(language);
      }, [language, i18n]);  // Only re-run the effect if language changes

    const [author, setAuthor] = useState("");
    const [title, setTitle] = useState("");
    const [post, setPost] = useState("");
    const navigate = useNavigate();
    const onSubmit= (event) => {
        event.preventDefault();
        /* At this moment id is mocked using a random number */
        const blog = {title, body: post, author, likes:0};
        addBlog(blog);
        setAuthor("");
        setTitle("");
        setPost("");
        navigate('/');
    }
    return (
    <div className='add-blog'>
      <h1>{t('Add new blog')}</h1>
      <div className="row">
        <form className="col s12" onSubmit={(event)=>{onSubmit(event)}}>
            <div className="row">
                <div className="input-field col s6">
                    <input id="author" type="text" className="validate" onChange={(event)=>{setAuthor(event.target.value)}} value={author}/>
                    <label htmlFor="author">{t('Name to display')}</label>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s6">
                    <input id="title" type="text" className="validate" onChange={(event)=>{setTitle(event.target.value)}} value={title}/>
                    <label htmlFor="title">{t('Title')}</label>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s12">
                    <textarea id="post" className="materialize-textarea" onChange={(event)=>{setPost(event.target.value)}} value={post}></textarea>
                    <label htmlFor="post">{t('Your post')}</label>
                </div>
            </div>
            <button className='btn' type='submit'>{t('Submit post')}</button>
        </form>
    </div>
  </div>
      
  )
}

export default AddBlog
