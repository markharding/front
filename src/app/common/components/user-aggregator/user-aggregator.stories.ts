import { RouterTestingModule } from '@angular/router/testing';
import { Story, Meta, moduleMetadata } from '@storybook/angular';
import { sampleUsers } from '../../../../tests/samples/sample-users';
import { ActivityV2ExperimentService } from '../../../modules/experiments/sub-services/activity-v2-experiment.service';
import { Session } from '../../../services/session';
import { ApiService } from '../../api/api.service';
import { Client } from '../../api/client.service';
import { CommonModule } from '../../common.module';
import { ConfigsService } from '../../services/configs.service';
import { ThemeService } from '../../services/theme.service';
import { UserAggregatorComponent } from './user-aggregator.component';

export default {
  title: 'Composite Components / User Aggregator',
  component: UserAggregatorComponent,
  argTypes: {
    users: {
      control: 'object',
      description: 'List of users to use.',
      defaultValue: sampleUsers,
    },
    totalCount: {
      defaultValue: 10,
      control: 'number',
      description: `Override the total count so that you can only pass 
        a few hydrated users through to display (for optimization) and
        have an accurate "and X others" summary.
      `,
    },
    usernameAmount: {
      defaultValue: 2,
      control: 'number',
      description: 'Amount of usernames to show.',
    },
    avatarAmount: {
      defaultValue: 3,
      control: 'number',
      description: 'Amount of avatars to show.',
    },
  },
  args: {},
  decorators: [
    moduleMetadata({
      imports: [CommonModule, RouterTestingModule],
      providers: [
        {
          provide: ConfigsService,
          useValue: {
            get: () => {
              return 'https://cdn.minds.com/';
            },
          },
        },
        {
          provide: Session,
          useValue: {
            getLoggedInUser: () => {
              return {
                guid: '456',
              };
            },
          },
        },
        {
          provide: Session,
          useValue: {
            getLoggedInUser: () => {
              return {
                guid: '456',
              };
            },
          },
        },
        {
          provide: ConfigsService,
          useValue: {
            get: () => {
              return 'https://cdn.minds.com/';
            },
          },
        },
        ThemeService,
        {
          provide: Client,
          useValue: {
            get: () => {
              return null;
            },
          },
        },
        {
          provide: ApiService,
          useValue: null,
        },
        {
          provide: ActivityV2ExperimentService,
          useValue: {
            isActive: () => {
              return false;
            },
          },
        },
      ],
    }),
  ],
} as Meta;

const Template: Story<UserAggregatorComponent> = (
  args: UserAggregatorComponent
) => ({
  props: args,
});

export const Basic = Template.bind({});
Basic.args = {};