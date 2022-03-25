import React from "react";

import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import {
  createBottomTabNavigator,
} from "react-navigation-tabs";

//splash
import Splash from "../container/Splash";

//auth
import Login from "../container/auth/login/Login";
import FindIdMain from "../container/auth/find-id/FindIdMain";
import FindIdResult from "../container/auth/find-id/FindIdResult";
import FindPwdMain from "../container/auth/find-pwd/FindPwdMain";
import FindPwdResult from "../container/auth/find-pwd/FindPwdResult";
import SignupMain from "../container/auth/signup/SignupMain";
import SignupTerms from "../container/auth/signup/SignupTerms";
import SignupAppleTerms from "../container/auth/signup/SignupAppleTerms";
import SignupTermsDetail from "../container/auth/signup/SignupTermsDetail";
import SignupAccount from "../container/auth/signup/SignupAccount";
import SignupBusinessAccount from "../container/auth/signup/SignupBusinessAccount";
import SignupPersonalData from "../container/auth/signup/SignupPersonalData";
import SignupOptionalPersonalData from "../container/auth/signup/SignupOptionalPersonalData";
import SignupInflow from "../container/auth/signup/SignupInflow";
import SignupResult from "../container/auth/signup/SignupResult";

//main
import Main from "../container/main/Main";
import KCTWebView from "../container/main/KCTWebView";

//store
import Store from "../container/store/Store";
import StoreBusiness from "../container/store/store-business/StoreBusiness";
import StoreAuction from "../container/store/store-auction/StoreAuction";
import StoreDetail from "../container/store/store-detail/StoreDetail";
import StoreGroup from "../container/store/store-group/StoreGroup";
import StorePayment from "../container/store/store-payment/StorePayment";
import StoreReserve from "../container/store/store-reserve/StoreReserve";
import ProductInquiry from '../container/store/product-inquiry/ProductInquiry';

//tag
import Tag from "../container/tag/Tag";
import TagDetail from "../container/tag/tag-detail/TagDetail";
import FeedDetail from "../container/tag/feed-detail/FeedDetail";
import FeedPost from "../container/tag/feed-post/FeedPost";
import FeedSearchProduct from "../container/tag/feed-post/FeedSearchProduct";
import FeedSearchTag from "../container/tag/feed-post/FeedSearchTag";
import FeedSelectPhoto from "../container/tag/feed-post/FeedSelectPhoto";
import FeedProduct from "../container/tag/feed-post/FeedProduct";

//mypage
import MyPage from "../container/mypage/MyPage";
import MySetting from "../container/mypage/mysetting/MySetting";
import MyFeed from "../container/mypage/myfeed/MyFeed";
import SubscriptionList from "../container/mypage/myfeed/subscription-list/SubscriptionList";
import FAQ from "../container/mypage/other-menu/faq/FAQ";
import QnA from "../container/mypage/other-menu/qna/QnA";
import QnABoard from "../container/mypage/other-menu/qna/QnABoard";
import Notice from "../container/mypage/other-menu/notice/Notice";
import NoticeDetail from "../container/mypage/other-menu/notice/NoticeDetail";
import MySettingAddress from "../container/mypage/mysetting/MySettingAddress";
import MySettingAccount from "../container/mypage/mysetting/MySettingAccount";
import MySettingPassword from "../container/mypage/mysetting/MySettingPassword";
import MySettingGroup from "../container/mypage/mysetting/MySettingGroup";
import MyProductQnA from "../container/mypage/other-menu/myproduct-qna/MyProductQnA";
import MySale from "../container/mypage/mysale/MySale";
import MyPoint from "../container/mypage/mypoint/MyPoint";
import Event from "../container/mypage/other-menu/event/Event";
import Withdraw from "../container/mypage/withdraw/Withdraw";
import WithdrawResult from "../container/mypage/withdraw/WithdrawResult";
import MyBuy from "../container/mypage/mybuy/MyBuy";
import MyBuyProductDetail from "../container/mypage/mybuy/mybuy-detail/MyBuyProductDetail";
import MyBuyCancelDetail from '../container/mypage/mybuy/mybuy-detail/MyBuyCancelDetail';
import MyBuyDelivery from "../container/mypage/mybuy/mybuy-delivery/MyBuyDelivery";
import MyBuyChange from "../container/mypage/mybuy/mybuy-change/MyBuyChange";
import MyBuyRefund from "../container/mypage/mybuy/mybuy-refund/MyBuyRefund";
import MyBuyRefundDetail from "../container/mypage/mybuy/mybuy-refund/MyBuyRefundDetail";
import MyBuyRefundResult from "../container/mypage/mybuy/mybuy-refund/MyBuyRefundResult";
import MyBuyTicketDetail from "../container/mypage/mybuy/mybuy-detail/MyBuyTicketDetail";
import TaxApplication from '../container/mypage/tax-application/TaxApplication';

import TicketDetail from "../container/ticket/ticket-detail/TicketDetail";
import TicketPayment from "../container/ticket/ticket-payment/TicketPayment";
import TicketPaymentResult from "../container/ticket/ticket-payment-result/TicketPaymentResult";
import TicketPaymentResultFail from "../container/ticket/ticket-payment-result/TicketPaymentResultFail";
import TicketAuction from "../container/ticket/ticket-auction/TicketAuction";
import TicketSale from "../container/ticket/ticket-sale/TicketSale";
import TicketSaleBoard from "../container/ticket/ticket-sale/TicketSaleBoard";

import Notification from "../container/notification/Notification";
import Search from "../container/search/Search";
import Cart from "../container/cart/Cart";
import Payment from "../container/payment/Payment";
import PaymentResult from "../container/payment/payment-result/PaymentResult";
import PaymentResultFail from "../container/payment/payment-result/PaymentResultFail";
import PaymentWebView from "../container/payment/payment-webview/PaymentWebView";
import CreateAddress from "../container/payment/delivery-address/CreateAddress";

import BottomTabBar from "../component/BottomTabBar";

const MainStack = createStackNavigator(
  {
    MainStack: {
      screen: Main,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteParams: "Main",
  }
);

const StoreStack = createStackNavigator(
  {
    StoreStack: {
      screen: Store,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteParams: "Store",
  }
);

const TagStack = createStackNavigator(
  {
    TagStack: {
      screen: Tag,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteParams: "Tag",
  }
);

const MyPageStack = createStackNavigator(
  {
    MyPageStack: {
      screen: MyPage,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteParams: "MyPage",
  }
);

const MainTabNavigator = createBottomTabNavigator(
  {
    Home: MainStack,
    Store: StoreStack,
    Tag: TagStack,
    MyPage: MyPageStack,
  },
  {
    initialRouteName: "Home",
    tabBarComponent: (props) => <BottomTabBar {...props} />,
  }
);

const TplusMain = createStackNavigator(
  {
    Main: {
      screen: MainTabNavigator,
      navigationOptions: {
        headerShown: false,
      },
    },
    KCTWebView: {
      screen: KCTWebView,
      navigationOptions: {
        headerShown: false,
      },
    },
    StoreBusiness: {
      screen: StoreBusiness,
      navigationOptions: {
        headerShown: false,
      },
    },
    StoreAuction: {
      screen: StoreAuction,
      navigationOptions: {
        headerShown: false,
      },
    },
    StoreDetail: {
      screen: StoreDetail,
      navigationOptions: {
        headerShown: false,
      },
    },
    StoreGroup: {
      screen: StoreGroup,
      navigationOptions: {
        headerShown: false,
      },
    },
    StoreReserve: {
      screen: StoreReserve,
      navigationOptions: {
        headerShown: false,
      },
    },
    StorePayment: {
      screen: StorePayment,
      navigationOptions: {
        headerShown: false,
      },
    },
    ProductInquiry: {
      screen: ProductInquiry,
      navigationOptions: {
        headerShown: false,
      },
    },
    TicketDetail: {
      screen: TicketDetail,
      navigationOptions: {
        headerShown: false,
      },
    },
    TicketPayment: {
      screen: TicketPayment,
      navigationOptions: {
        headerShown: false,
      },
    },
    TicketPaymentResult: {
      screen: TicketPaymentResult,
      navigationOptions: {
        headerShown: false,
      },
    },
    TicketPaymentResultFail: {
      screen: TicketPaymentResultFail,
      navigationOptions: {
        headerShown: false,
      },
    },
    TicketAuction: {
      screen: TicketAuction,
      navigationOptions: {
        headerShown: false,
      },
    },
    TicketSale: {
      screen: TicketSale,
      navigationOptions: {
        headerShown: false,
      },
    },
    TicketSaleBoard: {
      screen: TicketSaleBoard,
      navigationOptions: {
        headerShown: false,
      },
    },
    Search: {
      screen: Search,
      navigationOptions: {
        headerShown: false,
        gestureEnabled: false
      },
    },
    Cart: {
      screen: Cart,
      navigationOptions: {
        headerShown: false,
      },
    },
    Payment: {
      screen: Payment,
      navigationOptions: {
        headerShown: false,
      },
    },
    Notification: {
      screen: Notification,
      navigationOptions: {
        headerShown: false,
      },
    },
    TagDetail: {
      screen: TagDetail,
      navigationOptions: {
        headerShown: false,
      },
    },
    FeedDetail: {
      screen: FeedDetail,
      navigationOptions: {
        headerShown: false,
      },
    },
    FeedPost: {
      screen: FeedPost,
      navigationOptions: {
        headerShown: false,
      },
    },
    FeedSearchProduct: {
      screen: FeedSearchProduct,
      navigationOptions: {
        headerShown: false,
      },
    },
    FeedSearchTag: {
      screen: FeedSearchTag,
      navigationOptions: {
        headerShown: false,
      },
    },
    FeedSelectPhoto: {
      screen: FeedSelectPhoto,
      navigationOptions: {
        headerShown: false,
      },
    },
    FeedProduct: {
      screen: FeedProduct,
      navigationOptions: {
        headerShown: false,
      },
    },
    MySetting: {
      screen: MySetting,
      navigationOptions: {
        headerShown: false,
      },
    },
    MyFeed: {
      screen: MyFeed,
      navigationOptions: {
        headerShown: false,
      },
    },
    SubscriptionList: {
      screen: SubscriptionList,
      navigationOptions: {
        headerShown: false,
      },
    },
    FAQ: {
      screen: FAQ,
      navigationOptions: {
        headerShown: false,
      },
    },
    QnA: {
      screen: QnA,
      navigationOptions: {
        headerShown: false,
      },
    },
    QnABoard: {
      screen: QnABoard,
      navigationOptions: {
        headerShown: false,
      },
    },
    Notice: {
      screen: Notice,
      navigationOptions: {
        headerShown: false,
      },
    },
    NoticeDetail: {
      screen: NoticeDetail,
      navigationOptions: {
        headerShown: false,
      },
    },
    TermsDetail: {
      screen: SignupTermsDetail,
      navigationOptions: {
        headerShown: false,
      },
    },
    MySettingAddress: {
      screen: MySettingAddress,
      navigationOptions: {
        headerShown: false,
      },
    },
    CreateAddress: {
      screen: CreateAddress,
      navigationOptions: {
        headerShown: false,
        gestureEnabled: false,
      },
    },
    MySettingAccount: {
      screen: MySettingAccount,
      navigationOptions: {
        headerShown: false,
      },
    },
    MySettingPassword: {
      screen: MySettingPassword,
      navigationOptions: {
        headerShown: false,
      },
    },
    MySettingGroup: {
      screen: MySettingGroup,
      navigationOptions: {
        headerShown: false,
      },
    },
    PaymentWebView: {
      screen: PaymentWebView,
      navigationOptions: {
        headerShown: false,
      },
    },
    PaymentResult: {
      screen: PaymentResult,
      navigationOptions: {
        headerShown: false,
      },
    },
    PaymentResultFail: {
      screen: PaymentResultFail,
        navigationOptions: {
          headerShown: false,
      },
    },
    MyProductQnA: {
      screen: MyProductQnA,
      navigationOptions: {
        headerShown: false,
      },
    },
    MySale: {
      screen: MySale,
      navigationOptions: {
        headerShown: false,
      },
    },
    MyPoint: {
      screen: MyPoint,
      navigationOptions: {
        headerShown: false,
      },
    },
    Event: {
      screen: Event,
      navigationOptions: {
        headerShown: false,
      },
    },
    Withdraw: {
      screen: Withdraw,
      navigationOptions: {
        headerShown: false,
      },
    },
    WithdrawResult: {
      screen: WithdrawResult,
      navigationOptions: {
        headerShown: false,
      },
    },
    MyBuy: {
      screen: MyBuy,
      navigationOptions: {
        headerShown: false,
      },
    },
    MyBuyProductDetail: {
      screen: MyBuyProductDetail,
      navigationOptions: {
        headerShown: false,
      },
    },
    MyBuyCancelDetail: {
      screen: MyBuyCancelDetail,
      navigationOptions: {
        headerShown: false,
      },
    },
    MyBuyDelivery: {
      screen: MyBuyDelivery,
      navigationOptions: {
        headerShown: false,
      },
    },
    MyBuyChange: {
      screen: MyBuyChange,
      navigationOptions: {
        headerShown: false,
      },
    },
    MyBuyRefund: {
      screen: MyBuyRefund,
      navigationOptions: {
        headerShown: false,
      },
    },
    MyBuyRefundResult: {
      screen: MyBuyRefundResult,
      navigationOptions: {
        headerShown: false,
      },
    },
    MyBuyRefundDetail: {
      screen: MyBuyRefundDetail,
      navigationOptions: {
        headerShown: false,
      },
    },
    MyBuyTicketDetail: {
      screen: MyBuyTicketDetail,
      navigationOptions: {
        headerShown: false,
      },
    },
    TaxApplication: {
      screen: TaxApplication,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteParams: "Main",
  }
);

const AuthStack = createStackNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions: {
        headerShown: false,
      },
    },
    SignupMain: {
      screen: SignupMain,
      navigationOptions: {
        headerShown: false,
        gestureEnabled: false
      },
    },
    SignupTerms: {
      screen: SignupTerms,
      navigationOptions: {
        headerShown: false,
        gestureEnabled: false
      },
    },
    SignupAppleTerms: {
      screen: SignupAppleTerms,
      navigationOptions: {
        headerShown: false,
        gestureEnabled: false
      },
    },
    SignupTermsDetail: {
      screen: SignupTermsDetail,
      navigationOptions: {
        headerShown: false,
      },
    },
    SignupAccount: {
      screen: SignupAccount,
      navigationOptions: {
        headerShown: false,
        gestureEnabled: false
      },
    },
    SignupBusinessAccount: {
      screen: SignupBusinessAccount,
      navigationOptions: {
        headerShown: false,
        gestureEnabled: false
      },
    },
    SignupPersonalData: {
      screen: SignupPersonalData,
      navigationOptions: {
        headerShown: false,
        gestureEnabled: false
      },
    },
    SignupOptionalPersonalData: {
      screen: SignupOptionalPersonalData,
      navigationOptions: {
        headerShown: false,
        gestureEnabled: false
      },
    },
    SignupInflow: {
      screen: SignupInflow,
      navigationOptions: {
        headerShown: false,
        gestureEnabled: false
      },
    },
    SignupResult: {
      screen: SignupResult,
      navigationOptions: {
        headerShown: false,
        gestureEnabled: false
      },
    },
    FindIdMain: {
      screen: FindIdMain,
      navigationOptions: {
        headerShown: false,
      },
    },
    FindIdResult: {
      screen: FindIdResult,
      navigationOptions: {
        headerShown: false,
      },
    },
    FindPwdMain: {
      screen: FindPwdMain,
      navigationOptions: {
        headerShown: false,
      },
    },
    FindPwdResult: {
      screen: FindPwdResult,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteParams: "Splash",
  }
);

const RootNavigator = createSwitchNavigator(
  {
    AuthLoading: Splash,
    Auth: AuthStack,
    Main: TplusMain,
  },
  {
    initialRouteParams: "AuthLoading",
  }
);

const AppContainer = createAppContainer(RootNavigator);

export { AppContainer };
