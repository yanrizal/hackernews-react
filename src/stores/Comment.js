import { types, flow } from "mobx-state-tree";
import axios from 'axios';

export const CommentStore = types.model("CommentStore", {
    state: 'pending'
  })
  .actions(self => {
    const getComment = flow(function* getComment(id) {
      try {
        self.state = 'pending'
        const response = yield axios.get(`${process.env.REACT_APP_BASE_API_URL}/item/${id}.json`);
        self.state = 'done'
        return response.data
      } catch (error) {
        console.log("Failed", error)
        self.state = 'error'
      }
    })
    return {
      getComment
    }
  });

let _commentStore
export const useComment = () => {
  if (!_commentStore) {
    _commentStore = CommentStore.create({
      state: 'pending'
    })
  }

  return _commentStore;
}
