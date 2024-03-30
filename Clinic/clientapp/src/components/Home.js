import React, {Component} from 'react';

export default class Home extends Component {
    render(){
        return (
            <div>
                <h1>Welcome to our Clinic</h1>
                <p>
                    At Polmedic Clinic, we are dedicated to helping everyone we meet. Our vision is to have life without pain.
                    We strive to provide exceptional healthcare services with a patient-centric approach,
                    focusing on general care.
                </p>
                <p>
                    Having any questions? Feel free to contact us!
                </p>
                {/* I want to add a photo here hospital.png */}
                <img src="https://college.mayo.edu/media/mccms/content-assets/campus-amp-community/mayo-clinic-health-system/mayo-clinic-health-system-fiftyfifty-1419348_3632732_0029.jpg" alt="hospital" width="1000" height="666"></img>
            </div>
        )
    }
}