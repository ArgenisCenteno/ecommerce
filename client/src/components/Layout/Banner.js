import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ArrowRightCircle } from 'react-bootstrap-icons';
import 'animate.css';
import TrackVisibility from 'react-on-screen';
import  space2 from "../Layout/img/image1.svg"
import "../../styles/Banner.css"

export const Banner = () => {


    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [text, setText] = useState('');
    const [delta, setDelta] = useState(300 - Math.random() * 100);
    const [index, setIndex] = useState(1);
    const toRotate = [ "Ofertas inimaginables", "Variedad de productos", "La mejor relacion calidad-precio en un solo lugar" ];
    const period = 2000;
  
    useEffect(() => {
      let ticker = setInterval(() => {
        tick();
      }, delta);
  
      return () => { clearInterval(ticker) };
    }, [text])
  
    const tick = () => {
      let i = loopNum % toRotate.length;
      let fullText = toRotate[i];
      let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);
  
      setText(updatedText);
  
      if (isDeleting) {
        setDelta(prevDelta => prevDelta / 2);
      }
  
      if (!isDeleting && updatedText === fullText) {
        setIsDeleting(true);
        setIndex(prevIndex => prevIndex - 1);
        setDelta(period);
      } else if (isDeleting && updatedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setIndex(1);
        setDelta(500);
      } else {
        setIndex(prevIndex => prevIndex + 1);
      }
    }
  return (
    <section className="banner" id="inicio">
      <Container>
        <Row className="aligh-items-center">
          <Col xs={12} md={6} xl={7}>
            <TrackVisibility>
              {({ isVisible }) =>
              <div className={isVisible ? "animate__animated animate__fadeIn" : ""}> 
                <h1>{` De todo un poco Online`}  <span className="txt-rotate" dataPeriod="1000" data-rotate='[ "Ofertas inimaginables", "Variedad de productos", "La mejor relacion calidad-precio en un solo lugar" ]'><span className="wrap text-danger">{text}</span></span></h1>
                  <p>Nuestro equipo está comprometido en ofrecer un servicio cordial y eficiente, asistiéndote en tu búsqueda de los mejores productos. Nuestro objetivo es simplificar tu experiencia de compra de alimentos,
                     proporcionándote exactamente lo que necesitas, justo cuando lo necesitas. 
                     </p>
                 
              </div>}
            </TrackVisibility>
          </Col>
          <Col xs={12} md={6} xl={5}>
            <TrackVisibility>
              {({ isVisible }) =>
                <div className={isVisible ? "animate__animated animate__zoomIn" : ""}>
                     
                    <img src={space2} alt="Header Img" width="400px"/>
                </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
