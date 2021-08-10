import { types, flow } from "mobx-state-tree";
import axios from 'axios';

export const NewsModel = types.model("NewsModel", {
  id: types.maybeNull(types.number),
  title: types.optional(types.string, ""),
  url: types.optional(types.string, ""),
  score: types.maybeNull(types.number),
  time: types.maybeNull(types.number),
  kids: types.optional(types.array(types.number), []),
  by: types.optional(types.string, ""),
  descendants: types.maybeNull(types.number)
})

export const NewsStore = types.model("NewsStore", {
    stories: types.array(NewsModel),
    story: types.optional(NewsModel, {}),
    dataLimit: 30,
    state: 'pending'
  })
  .actions(self => {
    const getStory = flow(function* getStories(id) {
      try {
        self.state = 'pending'
        const response = yield axios.get(`${process.env.REACT_APP_BASE_API_URL}/item/${id}.json`);
        //console.log('r', response)
        self.story = response.data
        self.state = 'done_get_story'
        return response.data
      } catch (error) {
        console.log("Failed", error)
        self.state = 'error'
      }
    })
    const getStories = flow(function* getStories(pageNum) {
      try {
        self.state = 'pending'
        const response = yield axios.get(`${process.env.REACT_APP_BASE_API_URL}/topstories.json`);
        const startIndex = pageNum * self.dataLimit - self.dataLimit;
        const endIndex = startIndex + self.dataLimit;
        const stories = yield Promise.all(response.data.slice(startIndex, endIndex).map(getStory));
        self.stories = stories
        self.state = 'done_get_stories'
      } catch (error) {
        console.log("Failed", error)
        self.state = 'error'
      }
    })
    return {
      getStories,
      getStory
    }
  });

let _newsStore
export const useNews = () => {
  if (!_newsStore) {
    _newsStore = NewsStore.create({
      stories: [],
      story: {},
      state: 'pending'
    })
  }

  return _newsStore;
}
