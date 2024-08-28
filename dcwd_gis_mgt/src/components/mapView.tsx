import React from 'react';

const MapComponent: React.FC = () => {
    const googleMapUrl = "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d22398.307445712784!2d125.58314947021847!3d7.068021371569972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sph!4v1719284561486!5m2!1sen!2sph"
    return (
      <div style={{ margin: '30px 100px',height: '100vh', width: '95%'}}>
        <iframe
        width="95%"
        height="50%"
        src={googleMapUrl}
        allowFullScreen
        loading="lazy"
        style={{border: 0}}
        
        />
      </div>
    )
}

export default MapComponent