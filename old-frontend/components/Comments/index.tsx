import React, {useEffect, useState} from "react";
import {Button, Comment, Form, Mentions, message, Modal} from "antd";
import {GET_BUG_COMMENTS, GET_IDEA_COMMENTS, GET_TASK_COMMENTS, GET_CAPABILITY_COMMENTS,
  GET_COMMENT_USERS} from "../../graphql/queries";
import {getProp} from "../../utilities/filters";
import CustomAvatar2 from "../CustomAvatar2";
import {useMutation, useQuery} from "@apollo/react-hooks";
import {CREATE_TASK_COMMENT, CREATE_BUG_COMMENT, CREATE_IDEA_COMMENT,
  CREATE_CAPABILITY_COMMENT} from "../../graphql/mutations";
import Link from "next/link";
import showUnAuthModal from "../UnAuthModal";
import {connect} from "react-redux";


const {Option} = Mentions;

const actionName = "Add comment"

interface IUser {
  slug: string
  firstName: string,
  id: string
}

interface ICommentContainerProps {
  comments: IComment[]
  submit: Function
  loginUrl: string
  registerUrl: string
}

interface ICommentsProps {
  loginUrl: string,
  objectId: number,
  objectType: string,
  registerUrl: string
}

interface IAddCommentProps {
  submit: Function,
  objectId: number,
  loginUrl: string,
  registerUrl: string
}

interface IComment {
  id: number
  data: {
    person: {
      firstName: string
      slug: string
    }
    text: string
  }
  children: IComment[]
}

interface ICommentsText {
  text: string
}

const commentCreateType = {
  task: {
    mutation: CREATE_TASK_COMMENT, mutationKey: "createTaskComment"
  },
  idea: {
    mutation: CREATE_IDEA_COMMENT, mutationKey: "createIdeaComment"
  },
  bug: {
    mutation: CREATE_BUG_COMMENT, mutationKey: "createBugComment"
  },
  capability: {
    mutation: CREATE_CAPABILITY_COMMENT, mutationKey: "createCapabilityComment"
  },
};

const commentGetType = {
  task: GET_TASK_COMMENTS,
  idea: GET_IDEA_COMMENTS,
  bug: GET_BUG_COMMENTS,
  capability: GET_CAPABILITY_COMMENTS,
};


const CommentContainer: React.FunctionComponent<ICommentContainerProps> = ({comments, submit, objectType, loginUrl, registerUrl}) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const cType = commentCreateType[objectType];
  const [createComment] = cType ? useMutation(cType.mutation, {
    onCompleted(res) {
      if (getProp(res, `${cType.mutationKey}.success`, false)) {
        submit();
        setIsModalVisible(false);
        setCommentText("");
        message.success("Comment was sent").then();
      } else {
        message.error("Failed to send comment").then();
      }
    },
    onError({ graphQLErrors, networkError }) {
      if (graphQLErrors && graphQLErrors.length > 0) {
        let msg = graphQLErrors[0].message;
        if (msg === "The person is undefined, please login to perform this action") {
          showUnAuthModal(actionName, loginUrl, registerUrl);
        } else {
          message.error(msg).then();
        }
      }
      //@ts-ignore
      if (networkError && networkError.length > 0) {
        //@ts-ignore
        message.error(networkError[0].message).then();
      }
    }
  }
  ) : "";

  const addComment = () => {
    createComment({
      variables: {
        text: commentText, parentId: currentCommentId
      }
    }).then();
  }

  const closeModal = () => {
    setIsModalVisible(false);
    setCommentText("");
  }

  const [commentText, setCommentText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentCommentId, setCurrentCommentId] = useState<number>(0);

  const openSendSubCommentModal = (commentId: number) => {
    setIsModalVisible(true);
    setCurrentCommentId(commentId);
  }

  const CommentsText: React.FunctionComponent<ICommentsText> = ({text}) => {
    return (
      <>
        {
          text.split(' ').map((textItem, index) => {
            if (textItem[0] === '@') {
              return <Link key={index} href={`/${textItem.substring(1)}`}>{textItem + ' '}</Link>;
            } else {
              return <span key={index}>{textItem + ' '}</span>;
            }
          })
        }
      </>
    )
  }
    const vars = {
      hideTestUsers: true,
      startsWith: ''
    }
    const {refetch: commentUsersRefetch} = useQuery(GET_COMMENT_USERS, {
      variables: vars,
      fetchPolicy: "no-cache"
    });

    const onMentionChange = async (val: string) => {
      const index = val.indexOf('@');
      if (index !== -1) {
        const findString = val.slice(index + 1, index + 4);
        if (findString.match(/^[a-zA-Z]+$/) && findString.length >= 3) {
          vars.startsWith = findString;
          const {data: commentUsersData } = await commentUsersRefetch(vars);
          setUsers(commentUsersData.commentPeople);
        } else setUsers([]);
      } else setUsers([]);
      setCommentText(val);
    }

  return (
    <>
      {
        comments.map((comment: IComment, index) => (
          <Comment
            key={index}
            actions={[<span key="comment-nested-reply-to"
                            onClick={() => openSendSubCommentModal(comment.id)}>Reply to</span>]}
            author={<Link href={`/${comment.data.person.slug}`}>{comment.data.person.firstName}</Link>}
            avatar={ <CustomAvatar2 person={comment.data.person}/>}
            content={<CommentsText text={comment.data.text}/>}
          >
            <CommentContainer comments={getProp(comment, "children", [])}
                              objectType={objectType}
                              submit={submit}
            />
          </Comment>
        ))
      }

      <Modal
        title="Reply to comment" visible={isModalVisible} onOk={addComment} onCancel={closeModal}
        maskClosable={false}>
        <Mentions rows={2} onChange={val => onMentionChange(val)} value={commentText} notFoundContent={"Type a few characters to list matching users"}>
          {
            users.length > 0 ?
            users.map((user) => (
              <Option key={user.slug} value={user.slug}>{user.slug}</Option>
            )) : null
          }
        </Mentions>
      </Modal>
    </>
  )
};

const AddComment: React.FunctionComponent<IAddCommentProps> = ({objectId, objectType, submit, loginUrl, registerUrl}) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const {mutation, mutationKey} = commentCreateType[objectType];
  const [createComment] = useMutation(mutation, {
    onCompleted(res) {
      if (getProp(res, `${mutationKey}.success`, false)) {
        submit();
        setCommentText("");
        message.success("Comment was sent").then();
      } else {
        message.error("Failed to send comment").then();
      }
    },
    onError({ graphQLErrors, networkError }) {
      if (graphQLErrors && graphQLErrors.length > 0) {
        let msg = graphQLErrors[0].message;
        if (msg === "The person is undefined, please login to perform this action") {
          showUnAuthModal(actionName, loginUrl, registerUrl);
        } else {
          message.error(msg).then();
        }
      }
      //@ts-ignore
      if (networkError && networkError.length > 0) {
        //@ts-ignore
        message.error(networkError[0].message).then();
      }

    }
  }
  );
  const [commentText, setCommentText] = useState("");

  const addComment = () => {
    if (commentText === "") {
      return
    }
    createComment({
      variables: {
        text: commentText, objectId
      }
    }).then();
  }

  const vars = {
    hideTestUsers: true,
    startsWith: ''
  }
  const {refetch: commentUsersRefetch} = useQuery(GET_COMMENT_USERS, {
    variables: vars,
    fetchPolicy: "no-cache"
  });

  const onMentionChange = async (val: string) => {
    const index = val.indexOf('@');
    if (index !== -1) {
      const findString = val.slice(index + 1, index + 4);
      if (findString.match(/^[a-zA-Z]+$/) && findString.length >= 3) {
        vars.startsWith = findString;
        const {data: commentUsersData } = await commentUsersRefetch(vars);
        setUsers(commentUsersData.commentPeople);
      } else setUsers([]);
    } else setUsers([]);
    setCommentText(val);
  }

  return (
    <>
      <Form.Item>
        <Mentions rows={2} onChange={val => onMentionChange(val)} value={commentText} notFoundContent={"Type a few characters to list matching users"}>
          {
            users.length > 0 ?
            users.map((user) => (
              <Option key={user.slug} value={user.slug}>{user.slug}</Option>
            )) : null
          }
        </Mentions>
      </Form.Item>
      <Form.Item>
        <Button onClick={addComment} type="primary">
          Add Comment
        </Button>
      </Form.Item>
    </>
  )
}

const Comments: React.FunctionComponent<ICommentsProps> = ({objectId, objectType, loginUrl, registerUrl}) => {
  const {data, error, loading, refetch} = useQuery(commentGetType[objectType], {
    variables: {objectId}
  });

  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!error && !loading) {
      let fetchComments = getProp(data, `${objectType}Comments`, "[]");
      fetchComments = JSON.parse(fetchComments);
      setComments(fetchComments)
    }

  }, [data]);


  return (
    <>
      <CommentContainer comments={comments}
                        submit={refetch}
                        loginUrl={loginUrl}
                        registerUrl={registerUrl}
                        objectType={objectType}
      />
      <AddComment objectId={objectId}
                  submit={refetch}
                  loginUrl={loginUrl}
                  objectType={objectType}
                  registerUrl={registerUrl}
      />
    </>
  )
};

const mapStateToProps = (state: any) => ({
  loginUrl: state.work.loginUrl,
  registerUrl: state.work.registerUrl
});

export default connect(
  mapStateToProps,
  null
)(Comments);
