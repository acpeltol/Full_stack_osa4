const blog = require('../models/blog')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let result = 0
  for(let i = 0; i < blogs.length; i++){
    result += blogs[i].likes
  }

  return result
}

const favoriteBlog = (blogs) => {
  let bestBlog = blogs[0]
  for(let i = 1; i < blogs.length; i++){
    if(blogs[i].likes > bestBlog.likes){
      bestBlog = blogs[i]
    }
  }

  return bestBlog
}

const mostBlogs = (blogs) => {
  const dicto = {}

  for(let i = 0; i < blogs.length; i++){

    dicto[blogs[i].author] = (dicto[blogs[i].author] || 0) + 1
  }

  let mos_aut = null
  let max_am = -1

  for(const i in dicto){
    if(dicto[i] > max_am){
      max_am = dicto[i]
      mos_aut = i
    }
  }


  return ({
    author : mos_aut, blogs :max_am
  })
}

const mostLikesSummary = (blogs) => {
  const dicto = {}

  for(let i = 0; i < blogs.length; i++){

    const likes = blogs[i].likes
    const author = blogs[i].author

    dicto[author] = (dicto[author] || 0) + likes
  }

  let mos_aut = null
  let max_am = -1

  for(const i in dicto){
    if(dicto[i] > max_am){
      max_am = dicto[i]
      mos_aut = i
    }
  }


  return ({
    author : mos_aut, likes:max_am
  })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikesSummary
}