export let navigationMock = new (function () {
  this.getItems = jasmine.createSpy('getItems').and.callFake(() => {
    return [
      {
        name: 'Newsfeed',
        path: 'newsfeed',
        params: { ts: 1507027972937 },
        submenus: [],
        title: 'Newsfeed',
        text: 'Newsfeed',
        icon: 'home',
        class: '',
        visibility: 2,
        extras: [],
        active: true,
      },
      {
        name: 'Discovery',
        path: 'discovery/trending/channels',
        params: [],
        submenus: [
          {
            name: 'Trending',
            path: 'discovery/trending',
            params: [],
            submenus: [],
            title: 'Trending',
            text: 'Trending',
            icon: 'trending_up',
            class: '',
            visibility: 2,
            extras: [],
            active: false,
          },
          {
            name: 'Suggested',
            path: 'discovery/suggested',
            params: [],
            submenus: [],
            title: 'Suggested',
            text: 'Suggested',
            icon: 'call_split',
            class: '',
            visibility: 0,
            extras: [],
            active: false,
          },
          {
            name: 'Featured',
            path: 'discovery/featured',
            params: [],
            submenus: [],
            title: 'Featured',
            text: 'Featured',
            icon: 'star',
            class: '',
            visibility: 2,
            extras: [],
            active: false,
          },
          {
            name: 'My Media',
            path: 'discovery/owner',
            params: [],
            submenus: [],
            title: 'My Media',
            text: 'My Media',
            icon: 'person_pin',
            class: '',
            visibility: 0,
            extras: [],
            active: false,
          },
        ],
        title: 'Discovery',
        text: 'Discovery',
        icon: 'search',
        class: '',
        visibility: 2,
        extras: [],
        active: false,
      },
      {
        name: 'Blogs',
        path: 'blog/trending',
        params: [],
        submenus: [
          {
            name: 'Compose',
            path: 'blog/edit/new',
            params: [],
            submenus: [],
            title: 'Compose',
            text: 'Compose',
            icon: 'add',
            class: '',
            visibility: 0,
            extras: [],
            active: false,
          },
          {
            name: 'Featured',
            path: 'blog/featured',
            params: [],
            submenus: [],
            title: 'Featured',
            text: 'Featured',
            icon: 'star',
            class: '',
            visibility: 2,
            extras: [],
            active: false,
          },
          {
            name: 'Trending',
            path: 'blog/trending',
            params: [],
            submenus: [],
            title: 'Trending',
            text: 'Trending',
            icon: 'trending_up',
            class: '',
            visibility: 2,
            extras: [],
            active: false,
          },
          {
            name: 'My Blogs',
            path: 'blog/owner',
            params: [],
            submenus: [],
            title: 'My Blogs',
            text: 'My Blogs',
            icon: 'person_pin',
            class: '',
            visibility: 0,
            extras: [],
            active: false,
          },
        ],
        title: 'Blogs',
        text: 'Blogs',
        icon: 'subject',
        class: '',
        visibility: 2,
        extras: [],
        active: false,
      },
      {
        name: 'Groups',
        path: 'groups/featured',
        params: [],
        submenus: [
          {
            name: 'Create',
            path: 'groups/create',
            params: [],
            submenus: [],
            title: 'Create',
            text: 'Create',
            icon: 'add',
            class: '',
            visibility: 0,
            extras: [],
            active: false,
          },
          {
            name: 'Featured',
            path: 'groups/featured',
            params: [],
            submenus: [],
            title: 'Featured',
            text: 'Featured',
            icon: 'star',
            class: '',
            visibility: 2,
            extras: [],
            active: false,
          },
          {
            name: 'Trending',
            path: 'groups/trending',
            params: [],
            submenus: [],
            title: 'Trending',
            text: 'Trending',
            icon: 'trending_up',
            class: '',
            visibility: 2,
            extras: [],
            active: false,
          },
          {
            name: 'My Groups',
            path: 'groups/member',
            params: [],
            submenus: [],
            title: 'My Groups',
            text: 'My Groups',
            icon: 'person_pin',
            class: '',
            visibility: 2,
            extras: [],
            active: false,
          },
        ],
        title: 'Groups',
        text: 'Groups',
        icon: 'group_work',
        class: '',
        visibility: 2,
        extras: [],
        active: false,
      },
      {
        name: 'Admin',
        path: 'admin/analytics',
        params: [],
        submenus: [
          {
            name: 'Boost',
            path: 'admin/boosts',
            params: [],
            submenus: [],
            title: 'Boost (Admin)',
            text: 'Boost',
            icon: 'trending_up',
            class: '',
            visibility: 2,
            extras: [],
            active: false,
          },
          {
            name: 'Analytics',
            path: 'admin/analytics',
            params: [],
            submenus: [],
            title: 'Analytics',
            text: 'Analytics',
            icon: 'insert_chart',
            class: '',
            visibility: 2,
            extras: [],
            active: false,
          },
          {
            name: 'Pages',
            path: 'admin/pages',
            params: [],
            submenus: [],
            title: 'Pages',
            text: 'Pages',
            icon: 'create',
            class: '',
            visibility: 2,
            extras: [],
            active: false,
          },
          {
            name: 'Reports',
            path: 'admin/reports',
            params: [],
            submenus: [],
            title: 'Reports',
            text: 'Reports',
            icon: 'flag',
            class: '',
            visibility: 2,
            extras: [],
            active: false,
          },
          {
            name: 'Monetization review',
            path: 'admin/monetization',
            params: [],
            submenus: [],
            title: 'Monetization review',
            text: 'Monetization review',
            icon: 'attach_money',
            class: '',
            visibility: 2,
            extras: [],
            active: false,
          },
          {
            name: 'Program applications',
            path: 'admin/programs',
            params: [],
            submenus: [],
            title: 'Program applications',
            text: 'Program applications',
            icon: 'queue',
            class: '',
            visibility: 2,
            extras: [],
            active: false,
          },
          {
            name: 'Payouts queue',
            path: 'admin/payouts',
            params: [],
            submenus: [],
            title: 'Payouts queue',
            text: 'Payouts queue',
            icon: 'branding_watermark',
            class: '',
            visibility: 2,
            extras: [],
            active: false,
          },
          {
            name: 'Featured',
            path: 'admin/featured',
            params: [],
            submenus: [],
            title: 'Featured',
            text: 'Featured',
            icon: 'star',
            class: '',
            visibility: 2,
            extras: [],
            active: false,
          },
          {
            name: 'Hashtags',
            path: 'admin/tagcloud',
            params: [],
            submenus: [],
            title: 'Hashtags',
            text: 'Hashtags',
            icon: 'whatshot',
            class: '',
            visibility: 2,
            extras: [],
            active: false,
          },
          {
            name: 'Verfiy',
            path: 'admin/verify',
            params: [],
            submenus: [],
            title: 'Verify requests',
            text: 'Verfiy',
            icon: 'verified_user',
            class: '',
            visibility: 2,
            extras: [],
            active: false,
          },
        ],
        title: 'Admin',
        text: 'Admin',
        icon: 'settings_input_component',
        class: '',
        visibility: -1,
        extras: [],
        active: false,
      },
    ];
  });
  this.setCounter = jasmine.createSpy('setCounter').and.stub();
})();
