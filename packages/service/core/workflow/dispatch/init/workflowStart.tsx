import { NodeInputKeyEnum } from '@fastgpt/global/core/workflow/constants';
import type { ModuleDispatchProps } from '@fastgpt/global/core/workflow/type/index.d';
export type UserChatInputProps = ModuleDispatchProps<{
  [NodeInputKeyEnum.userChatInput]: string;
}>;

export const dispatchWorkflowStart = (props: Record<string, any>) => {
  const {
    variables: { userChatInput },
    params: { userChatInput: query }
  } = props as UserChatInputProps;
  return {
    userChatInput: query || userChatInput
  };
};
