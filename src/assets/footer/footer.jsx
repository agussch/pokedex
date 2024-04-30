import React from 'react'
import "./footer.css"

const Footer = () => {
  return (
    <footer>
       
        <div className="top-footer">
            <p className='copyr'>Copyright 2024. All rights are reserverd</p>
            <div className="footer-cont">
                <div className="contact-cont">
                    <div className="contact-icons">
                        <div className="box-icons">
                            <div className="contact-info">
                                <h3>Mail</h3>
                                <p><a href="mailto:agustinschkoff@gmail.com" target="_blank">agustinschkoff@gmail.com</a></p>
                            </div>
                        </div> 
                    </div>
                </div>
                <div className="footer-icons">
                    <span className='icons'>
                    <a href="https://github.com/agussch" className='git'><img src="./img/github.png" alt="" /></a>
                    <a href="https://www.linkedin.com/in/agustin-schanwarzkoff-001732279/" className='linkedin'><img src="./img/linkedin.png" alt="" /></a>
                    </span>
                </div> 
            </div>
            
        </div>
    </footer>
  )
}

export default Footer