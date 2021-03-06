import Axios from 'axios';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';
function Comment(props) {

    const videoId = props.postId;
    const user = useSelector(state =>state.user);
    const [CommentValue, setCommentValue] = useState("");

    const handleClick = (event) => { 
        setCommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault(); //submit했을때 새로고침 안되도록...

        const variable = {
            content: CommentValue,
            writer: user.userData._id,
            postId: videoId //props.postId 
        }

        Axios.post('/api/comment/saveComment',variable)
        .then(response => {
            if(response.data.success){
                console.log(response.data)
                setCommentValue("")
                props.refreshFunction(response.data.result)
            } else {
                alert('코코멘트를 저장하지 못했습니다.')
            
            }
        })
    }

    return (
        <div>
            <br />
            <p>Replies</p>
            <hr />

            {/* comment Lists */}
            {props.commentLists && props.commentLists.map((comment,index)=>(
                (!comment.responseTo &&
                    <React.Fragment key={index} >
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={props.videoId}/>    
                        <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} postId={props.videoId} commentLists={props.commentLists} />
                    </React.Fragment>
                    
                )
                

            ))}

            {/* Root Comment Form */}

            <form style={{ display: 'flex' }} onSubmit={onSubmit} >
                <textarea 
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleClick}
                    value={CommentValue}
                    placeholder="코멘트를 작성해주세요"
                />
                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >Submit</button>
            </form>

        </div>
    )
}

export default Comment
