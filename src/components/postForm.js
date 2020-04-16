import React, { useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Button, Form, message, Upload, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";

import { GET_POST_DATA } from "../reducers/actions";

const { TextArea } = Input;

const formData = new FormData();

const PostForm = ({ postId }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const { userInfo, post } = useSelector((state) => state);

  const inputTitle = useRef(null);
  const inputContent = useRef(null);

  const dispatch = useDispatch();

  const getBase64 = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }, []);

  const handleCancel = useCallback(() => setPreviewVisible(false), []);

  const handlePreview = useCallback(
    async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }

      setPreviewImage(file.url || file.preview);
      setPreviewVisible(true);
    },
    [getBase64]
  );

  const handleChange = useCallback(({ fileList }) => {
    setFileList(fileList);
  }, []);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const onChangeTitle = useCallback((e) => {
    setContent(e.target.value);
  }, []);
  const onChangeContent = useCallback(
    (e) => {
      setTitle(e.target.value);
      console.log("postId", postId);
    },
    [postId]
  );

  const updatePost = useCallback(() => {
    axios({
      method: "post",
      url: "/post/update",
      params: {
        id: postId,
        title,
        content,
      },
      withCredentials: true,
    })
      .then((res) => {
        console.log(res);

        //안해도 되는건가?
        // dispatch({
        //   type: UPDATE_POST_ACTION,
        //   payload: { content, title, id: postId },
        // });

        inputTitle.current.state.value = null;
        inputContent.current.state.value = null;
      })
      .catch((error) => {
        console.error("😡 ", error);
      });
  }, [content, postId, title]);

  const onSubmit = useCallback(async () => {
    if (!(userInfo && userInfo.username)) {
      message.warning("Login Please! 😱");
      return;
    }

    if (postId !== undefined) {
      updatePost();
      return;
    }

    axios({
      method: "post",
      url: "/post/publish",
      params: {
        title,
        content,
      },
      withCredentials: true,
    })
      .then((res) => {
        fileList.forEach((file) => {
          formData.append("file", file.originFileObj);
        });
        console.log("res", fileList[0], res.data);
        axios({
          method: "post",
          url: "/post/uploadPostImage",
          data: formData,
          params: { postId: res.data.id },
          withCredentials: true,
        })
          .then((res) => {
            console.log("upload", res);
            message.success(res.data);
          })
          .catch((error) => {
            message.warning("Upload failed");
            console.error("😡 ", error);
          });

        dispatch({
          type: GET_POST_DATA,
          payload: res.data,
        });
      })
      .then(() => {
        inputTitle.current.state.value = null;
        inputContent.current.state.value = null;
        setFileList([]);
      })
      .catch((error) => {
        console.error("😡 ", error);
      });
  }, [content, dispatch, fileList, postId, title, updatePost, userInfo]);

  return (
    <Form
      style={{
        margin: " 0 auto",
        width: 350,
      }}
    >
      <Input
        placeholder="title"
        ref={inputTitle}
        allowClear
        onChange={onChangeContent}
      />
      <br />
      <br />
      <TextArea
        placeholder="content"
        ref={inputContent}
        allowClear
        onChange={onChangeTitle}
      />
      <br />
      <br />
      <div className="clearfix">
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
      <Button
        type="default"
        value="large"
        htmlType="submit"
        onClick={onSubmit}
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto",
          width: 350,
        }}
      >
        publish
      </Button>
    </Form>
  );
};

export default React.memo(PostForm);
