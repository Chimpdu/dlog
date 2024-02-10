import { useContext, useEffect} from 'react'
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../LanguageContext';
function About() {
  const { t, i18n } = useTranslation();
  const { language } = useContext(LanguageContext);
  useEffect(() => {
      i18n.changeLanguage(language);
    }, [language, i18n]);  // Only re-run the effect if language changes
  return (
    <div>
      <h1>About here!</h1>
    </div>
  )
}

export default About
