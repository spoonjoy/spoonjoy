import ChefRJ from 'public/images/chef-rj.png'

const UserInfo = ({ username }: { username: string }) => {
  return (
    <div className="mx-2 mt-2 flex text-left">
      <img className="h-8 w-8 rounded-full" src={ChefRJ} alt="" />
      <div className="pl-2">
        <span className="block text-xs font-light tracking-normal opacity-[80%]">
          Recipe by:
        </span>
        <span className="block text-sm font-normal leading-none tracking-wide">
          {username}
        </span>
      </div>
    </div>
  )
}

export default UserInfo
