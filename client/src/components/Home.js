import React, {useContext, useEffect} from 'react'
import Blogs from './Blogs'
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../LanguageContext';
function Home({blogs, deleteBlog, updateLikes}) {
  const { t, i18n } = useTranslation();
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);  // Only re-run the effect if language changes

  return (
    <div className='home'>
      <h1>{t('Welcome to Dlog')}</h1>
      <h3 className='secondary-header'> {t('All blogs:')} </h3>
      <Blogs blogs = {blogs} deleteBlog = {deleteBlog} updateLikes={updateLikes}/>
      <div className="divider"></div>
      <h3 className='secondary-header'> {t('Blogs by yuxin:')}</h3>
      <Blogs blogs = {blogs.filter((blog)=> {return blog.author=== "Yuxin"})} deleteBlog = {deleteBlog} updateLikes={updateLikes}/>
    </div>
  )
}

export default Home;
