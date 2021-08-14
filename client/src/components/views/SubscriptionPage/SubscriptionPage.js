
import moment from 'moment';
import React, {useEffect,useState} from 'react';
import { FaCode } from "react-icons/fa";
import {Card,Icon, Avatar,Col,Typography,Row} from 'antd';
import Axios from 'axios';

const { Title } = Typography;
const { Meta } = Card;

function SubscriptionPage() {

    
    const [Video, setVideo] = useState([])

    const subscriptionVariable = {
        userFrom : localStorage.getItem('userId')
    }
    
    useEffect(()=>{ // Dom이 Rending 될때 무엇을 할건지 //react hook기능
        Axios.post('/api/video/getSubscriptionVideos', subscriptionVariable)
        .then(response=>{
            if(response.data.success){
                console.log(response.data)
                setVideo(response.data.videos)
            } else {
                alert('비디오 가져오기를 실패했습니다.');
            }
        })
    }, [])  // [] << 대괄호가 있으면 한번만. 없으면 계속 실행.

    const renderCards =  Video.map((video,index)=>{


    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor((video.duration - minutes *60));

    return <Col key={index} lg={6} md={8} xs={24}>  {/* antd*/}
                <div style={{ position: 'relative'}}>
                    <a href={`/video/${video._id}`}>
                        <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail" />
                        <div className="duration">
                            <span>{minutes} : {seconds} </span>

                        </div>
                    </a>
                </div>
                <br />

                <Meta   
                    avatar={
                        <Avatar src={video.writer.image} />                        
                    }
                    title={video.title}
                    description=""
                />
                <span>{video.writer.name} </span><br />
                <span style={{ marginLeft: '3rem' }}>{video.views} views</span> - <span>{moment(video.createdAt).format("MMM Do YY")}</span>
                
            </Col> 
})

return (
    <div style={{ width: '85%', margin: '3rem auto' }}>
        <Title level={2} > Recommended</Title>
        <hr />

        <Row gutter={[32,16]}>

            {renderCards}


        </Row>
            

    </div>

)
}


export default SubscriptionPage
