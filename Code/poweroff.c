#include <stdio.h>
#include <stdlib.h>

int main()
{
    int input, endTime;
    char strbuff[100];   /**< 倒计时关机命令 */
    char strdebuff[100];  /**< 定时关机命令 */
    char time[20];       /**< 定时关机时间 */
    printf("**********************************\n");
    printf("       欢迎使用定时关机工具\n");
    printf("        1.定时关机\n");
    printf("        2.倒计时关机\n");
    printf("        3.取消倒计时关机\n");
    printf("        4.取消定时关机\n");
    printf("**********************************\n");
    printf("请输入您的选择:");
    scanf("%d", &input);

    if (input != 1 && input != 2 && input != 3 && input != 4)
    {
        printf("输入错误!\n");
        exit(-1);
    }
    fflush(stdin);
    switch (input)
    {
        case 1: printf("请输入关机时间(时:分):HH:mm\n");
                gets(time);
                sprintf(strdebuff, "SCHTASKS /Create /TN shutdown /ST %s /SC ONCE /TR \"shutdown /s /t 0\"", time);
                system(strdebuff);
                printf("您的计算机将在%s关闭!\n", time);
                system("pause");
                break;
        case 2: printf("请输入倒计时间(单位为分钟):");
                scanf("%d", &endTime);
                endTime *= 60;
                sprintf(strbuff, "shutdown /s /t %d", endTime);
                system(strbuff);
                printf("您的计算机将在%d分钟后关闭!\n", endTime/60);
                system("pause");
                break;
        case 3: system("shutdown /a");
                printf("倒计时关机已取消!\n");
                system("pause");
                break;
        case 4: system("SCHTASKS /Delete /TN shutdown");
                printf("定时关机已取消\n");
                break;
    }
    return 0;
}