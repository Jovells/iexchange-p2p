import { FAQs } from "@/common/data/faqs";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";


const FaqsSection = () => {
    return (
        <div className="gap-10 w-full pb-10 mt-6 lg:mt-20">
            <h2 className="text-4xl font-medium text-center text-[#3D4651] dark:text-white">
                Frequently Asked Questions
            </h2>
            <div>
                <Accordion type="multiple" className="w-full flex flex-col gap-5 lg:gap-6 lg:px-0">
                    {
                        FAQs.map((faq, index) => (
                            <AccordionItem key={index} value={`question-${index + 1}`} className="border-none px-1.5 rounded-lg">
                                <AccordionTrigger className="!no-underline text-[#3D4651] dark:text-[#A4ACB7]">
                                    <div className="grid grid-cols-[auto_1fr] items-center justify-center gap-3 !no-underline">
                                        <div className="flex items-center justify-center w-10 h-10 border rounded-lg dark:border-gray-700 text-[#3D4651] dark:text-[#A4ACB7]">
                                            {index + 1}
                                        </div>
                                        <h3 className="text-lg lg:text-xl font-medium text-left text-[#3D4651] dark:text-[#A4ACB7] hover:text-gray-500 dark:hover:text-white">
                                            {faq.title}
                                        </h3>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="lg:text-base px-3 lg:px-10 text-[#3D4651] dark:text-[#A4ACB7]">
                                    {faq.content}
                                </AccordionContent>
                            </AccordionItem>
                        ))
                    }
                </Accordion>
            </div>
        </div>
    );
};

export default FaqsSection;
