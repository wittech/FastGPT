import React, { useState } from 'react';
import { Textarea, Button, ModalBody, ModalFooter } from '@chakra-ui/react';
import MyModal from '@fastgpt/web/components/common/MyModal';
import { useTranslation } from 'next-i18next';
import { useToast } from '@fastgpt/web/hooks/useToast';
import { useContextSelector } from 'use-context-selector';
import { WorkflowContext } from '../context';

type Props = {
  onClose: () => void;
};

const ImportSettings = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const initData = useContextSelector(WorkflowContext, (v) => v.initData);
  const [value, setValue] = useState('');

  return (
    <MyModal
      isOpen
      w={'600px'}
      onClose={onClose}
      iconSrc="/imgs/modal/params.svg"
      title={t('app.Import Configs')}
    >
      <ModalBody>
        <Textarea
          placeholder={t('app.Paste Config') || 'app.Paste Config'}
          defaultValue={value}
          rows={16}
          onChange={(e) => setValue(e.target.value)}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          variant="whiteBase"
          onClick={() => {
            if (!value) {
              return onClose();
            }
            try {
              const data = JSON.parse(value);
              initData(data);
              onClose();
            } catch (error) {
              toast({
                title: t('app.Import Configs Failed')
              });
            }
          }}
        >
          确认
        </Button>
      </ModalFooter>
    </MyModal>
  );
};

export default React.memo(ImportSettings);
