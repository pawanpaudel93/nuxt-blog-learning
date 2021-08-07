import axios from 'axios'
import Vuex from 'vuex'

const createStore = () => {
    return new Vuex.Store({
        state: {
            loadedPosts: []
        },
        mutations: {
            setPosts(state, posts) {
                state.loadedPosts = posts
            },
            addPost(state, post) {
                state.loadedPosts.push(post)
            },
            editPost(state, editedPost) {
                const postIndex = state.loadedPosts.findIndex(post => post.id === editedPost.id)
                state.loadedPosts[postIndex] = editedPost

            },
        },
        actions: {
            nuxtServerInit(vuexContext, context) {
                return axios.get(process.env.baseUrl + "/posts.json").then(res => {
                    const postsArray = []
                    for (let key in res.data) {
                        postsArray.push({ ...res.data[key], id: key })
                    }
                    vuexContext.commit('setPosts', postsArray)
                }).catch(error => {
                    console.error(error)
                })
            },
            addPost(vuexContext, post) {
                const createdPost = { ...post, id: Date.now() }
                return axios.post(process.env.baseUrl + "/posts.json", createdPost)
                    .then((result) => {
                        vuexContext.commit('addPost', { ...createdPost, id: result.data.name })
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            },
            editPost(vuexContext, editedPost) {
                const updatedPost = { ...editedPost, updatedDate: new Date() }
                return axios
                    .put(
                        process.env.baseUrl + "/posts/" +
                        editedPost.id +
                        ".json",
                        editedPost
                    )
                    .then(res => {
                        vuexContext.commit('editPost', updatedPost)
                    })
                    .catch((err) => console.error(err));
            },
            setPosts(vuexContext, posts) {
                vuexContext.commit('setPosts', posts)
            }
        },
        getters: {
            loadedPosts(state) {
                return state.loadedPosts
            }
        }
    })
}

export default createStore