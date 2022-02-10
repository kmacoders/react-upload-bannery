import { render } from 'preact'
import { App } from './app'
import './index.css'

const elMount = document.querySelector('.bannerys-upload');
if (elMount) {
  const frontImg = elMount.getAttribute('data-front');
  const backImg = elMount.getAttribute('data-back');
  render(<App front={frontImg} back={backImg}/>, elMount)
}



