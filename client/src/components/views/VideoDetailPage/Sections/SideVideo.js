import React, { useEffect, useState } from 'react'
import Axios from 'axios';


function SideVideo() {

    const [sideVideos, setsideVideos] = useState([])

    useEffect(()=>{ // Dom이 Rending 될때 무엇을 할건지 //react hook기능
        Axios.get('/api/video/getVideos')
        .then(response=>{
            if(response.data.success){
                console.log(response.data.videos)
                setsideVideos(response.data.videos)
            } else {
                alert('비디오 가져오기를 실패했습니다.');
            }
        })
    }, [])  // [] << 대괄호가 있으면 한번만. 없으면 계속 실행.

    const rederSideVideo = sideVideos.map((video,index)=>{

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor((video.duration - minutes *60));

        return  <div key={index} style = {{ display: 'flex', marginBottom: "1rem", padding: '0 2rem'}}>
                    <div style={{ width: '40%', marginBottom: '1rem'}} >
                        <a href>
                            <img style-={{ width:'100%', height: '100%'}} src={`http://localhost:5000/${video.thumbnail}`} alt="thumnail" />
                        </a>
                    </div>  
                    <div style = {{ width: '50%'}}>
                        <a href style={{ color: "gray", marginRight: '1rem'}}>
                            <span style={{ fontSize: '1rem', color: 'black'}}>{video.title}</span><br />
                            <span>{video.writer.name} </span><br />
                            <span>{video.views} views </span><br />
                            <span>{minutes} : {seconds} </span><br />
                        </a>    
                    </div>
                </div>
    })    

    return (
        <React.Fragment>
            <div style={{ marginTop: '3rem'}} />

            {rederSideVideo}

        </React.Fragment>


    )
}

export default SideVideo
