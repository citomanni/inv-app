
const HeroText = () => {
  return (
    <>
      <div>
        <p className="text-[#CCCCCC]/85 text-2xl sm:text-3xl font-bold tracking-wide uppercase mb-4">
          SIMPLIFY YOUR RETIREMENT
        </p>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#181B31] leading-tight">
          INVEST IN CARDONE CAPITAL WITH YOUR
          <br />
          SELF-DIRECTED IRA OR 401K
        </h1>
      </div>
      <ul className="space-y-1">
        <li className="flex items-start">
          <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-4 flex-shrink-0"></div>
          <span className="text-lg text-gray-700">
            Investment Backed by Real Assets
          </span>
        </li>
        <li className="flex items-start">
          <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-4 flex-shrink-0"></div>
          <span className="text-lg text-gray-700">
            Does Not Require Taking Money Out of Account
          </span>
        </li>
        <li className="flex items-start">
          <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-4 flex-shrink-0"></div>
          <span className="text-lg text-gray-700">
            Benefit From Asset Appreciation Over Time
          </span>
        </li>
      </ul>

      <p className="text-gray-700 leading-relaxed sm:pt-0 py-5">
        If you have an existing IRA or 401K from a previous employer, it is
        likely that you will be able to self-direct all or a portion of it into
        our investment vehicles. Check with your current custodian to see if
        they will allow you to self-direct your retirement account. If the
        answer is yes, please call or text a member of our team at 305-407-0276
        or by email at invest@cardonecapital.com, and we will introduce you to
        one of the custodians that we work with that will allow you to invest in
        alternative assets using your retirement funds.
      </p>
    </>
  );
};

export default HeroText;
