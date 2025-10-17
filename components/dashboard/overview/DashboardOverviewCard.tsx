import React from 'react'

type DashboardOverviewCardPropType = {
    title: string,
    amount: string,
    percent: number,
    bgStyle: string,
}

const DashboardOverviewCard = ({ title, amount, percent, bgStyle }: DashboardOverviewCardPropType) => {
    return (
        <div className={`w-full rounded-xl ${bgStyle} flex flex-col gap-2.5 justify-center p-4 lg:p-6`}>
          <p className="text-xs md:text-sm text-[#667185]">{title}</p>
          <h3 className="text-base md:text-xl font-semibold text-[#101928]">{amount}</h3>
          <div className="flex items-center gap-1">
            <span className={`p-1.5 ${percent < 0 ? 'bg-[#FFEBEB]' : 'bg-[#E7FAF3]'} flex items-center justify-center rounded-full`}>
              {percent < 0 ? (
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 7H0.5V7.5H1V7ZM1.35355 7.35355L7.35355 1.35355L6.64645 0.646447L0.646447 6.64645L1.35355 7.35355ZM4.5 6.5H1V7.5H4.5V6.5ZM1.5 7V3.5H0.5V7H1.5Z" fill="#DC2626"/>
                </svg>
              ) : (
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 1H7.5V0.5H7V1ZM6.64645 0.646448L0.646445 6.6465L1.35355 7.3536L7.35355 1.35355L6.64645 0.646448ZM3.5 1.5H7V0.5H3.5V1.5ZM6.5 1V4.5H7.5V1H6.5Z" fill="#099137" />
                </svg>
              )}
            </span>
            <p className={`text-xs ${percent < 0 ? 'text-[#DC2626]' : 'text-[#099137]'}`}>{percent || 0}% this week</p>
          </div>
        </div>
    )
}

export default DashboardOverviewCard