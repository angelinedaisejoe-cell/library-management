import { createElement } from "react"
import { Profilecard } from "./components/Profilecrd"
import AlexaImage from "./images/alexa.png"
import CortanaImage from "./images/cortana.png"
import SiriImage from "./images/siri.png"
export default function App() { 
  
  
  return (
    <div className="text-lg text-center font-extrabold font-sans">Personal Digital Assistants 
        <div className="flex justify-center gap-4">
            
            <br />
      
    <Profilecard name="Alexa" handle="@alexa" image={AlexaImage} />
    <Profilecard name="Cortana" handle="@cort" image={CortanaImage} />
    <Profilecard name="Siri" handle="@siri" image={SiriImage} />
    
     </div> 
    </div>
  )
}