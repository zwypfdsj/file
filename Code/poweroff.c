#include <stdio.h>
#include <stdlib.h>

int main()
{
    int input, endTime;
    char strbuff[100];   /**< ����ʱ�ػ����� */
    char strdebuff[100];  /**< ��ʱ�ػ����� */
    char time[20];       /**< ��ʱ�ػ�ʱ�� */
    printf("**********************************\n");
    printf("       ��ӭʹ�ö�ʱ�ػ�����\n");
    printf("        1.��ʱ�ػ�\n");
    printf("        2.����ʱ�ػ�\n");
    printf("        3.ȡ������ʱ�ػ�\n");
    printf("        4.ȡ����ʱ�ػ�\n");
    printf("**********************************\n");
    printf("����������ѡ��:");
    scanf("%d", &input);

    if (input != 1 && input != 2 && input != 3 && input != 4)
    {
        printf("�������!\n");
        exit(-1);
    }
    fflush(stdin);
    switch (input)
    {
        case 1: printf("������ػ�ʱ��(ʱ:��):HH:mm\n");
                gets(time);
                sprintf(strdebuff, "SCHTASKS /Create /TN shutdown /ST %s /SC ONCE /TR \"shutdown /s /t 0\"", time);
                system(strdebuff);
                printf("���ļ��������%s�ر�!\n", time);
                system("pause");
                break;
        case 2: printf("�����뵹��ʱ��(��λΪ����):");
                scanf("%d", &endTime);
                endTime *= 60;
                sprintf(strbuff, "shutdown /s /t %d", endTime);
                system(strbuff);
                printf("���ļ��������%d���Ӻ�ر�!\n", endTime/60);
                system("pause");
                break;
        case 3: system("shutdown /a");
                printf("����ʱ�ػ���ȡ��!\n");
                system("pause");
                break;
        case 4: system("SCHTASKS /Delete /TN shutdown");
                printf("��ʱ�ػ���ȡ��\n");
                break;
    }
    return 0;
}