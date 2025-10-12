const bcrypt =require('bcrypt')
const saltround = 10

const hashpass = async(password)=>{
    try {
        const hashp = await bcrypt.hash(password,saltround)
        return hashp
    } catch (error) {
        console.log('Something went wrong!!' + error.message)
    }
}
const comparepass = async(password,hash)=>{
    try {
        const comparep = await bcrypt.compare(password,hash)
        return comparep
    } catch (error) {
        console.log('Something went wrong!!' + error.message)
    }
}

module.exports = {hashpass,comparepass}